import { Action, Thunk, action, thunk } from 'easy-peasy'

import { TreeBulkUpdateResponse, saveTreeNodes, getTree, getBranch } from '../api/tree'
import { ApiError, ApiErrorResponse } from '../helpers/api'

import { TreeNode } from '../types'

type TreeNodeMap = Record<TreeNode['id'], TreeNode>
type ApiErrorTypes = 'loadData' | 'saveChanges'

export interface DbTreeStoreModel {
  tree?: TreeNode
  treeNodes: TreeNodeMap // For quick node getting

  isLoading: boolean
  savedSuccessfully?: boolean
  apiErrors: Record<ApiErrorTypes, string | null>
  confirmOverwriteIds?: TreeNode['id'][]
  addedNodeIds?: TreeNode['id'][]

  // Data retrieving
  setTree: Action<DbTreeStoreModel, TreeNode>
  reloadTree: Thunk<DbTreeStoreModel>
  setLoading: Action<DbTreeStoreModel, boolean>
  setBranchNodes: Action<DbTreeStoreModel, [TreeNode['id'], TreeNode[]]>
  loadBranch: Thunk<DbTreeStoreModel, TreeNode>

  // Editing
  saveChanges: Thunk<DbTreeStoreModel, [TreeNode[], TreeNode['id'][]?]>
  setSavedSuccessfully: Action<DbTreeStoreModel, boolean>
  setAddedNodeIds: Action<DbTreeStoreModel, TreeNode['id'][]>
  setOverwriteConfirmation: Action<DbTreeStoreModel, TreeNode['id'][]>
  setApiError: Action<DbTreeStoreModel, [ApiErrorTypes, string | null]>
  clearApiErrors: Action<DbTreeStoreModel>
}

const treeReducer = (item: TreeNode, acc: TreeNodeMap): TreeNodeMap => {
  acc[item.id] = item
  if (item.childs) {
    item.childs.forEach(child => ({
      ...acc,
      ...treeReducer(child, acc),
    }))
  }
  return acc
}

export const dbTreeStoreModel: DbTreeStoreModel = {
  isLoading: false,
  treeNodes: {},

  apiErrors: {
    loadData: null,
    saveChanges: null,
  },

  setTree: action((state, tree) => {
    const treeNodes = treeReducer(tree, {})
    state.treeNodes = treeNodes
    state.tree = tree
  }),

  setBranchNodes: action((state, payload) => {
    const [id, nodes] = payload
    if (!state.tree) {
      return
    }
    // TODO: ref this
    const treeNodes = treeReducer(state.tree, {})
    if (treeNodes?.[id]) {
      treeNodes[id].childs = nodes
      delete treeNodes[id].hasChilds
    }
    state.treeNodes = {
      ...treeNodes,
      ...nodes,
    }
  }),

  setLoading: action((state, payload) => {
    state.isLoading = payload
  }),

  reloadTree: thunk(async (actions) => {
    const { setLoading, setApiError, setTree } = actions
    setApiError(['loadData', null])
    setLoading(true)
    const result = await getTree()
    if ((result as ApiErrorResponse).error) {
      setApiError(['loadData', (result as ApiErrorResponse).error.message])
      setLoading(false)
      return
    }
    if (result) {
      setTree(result as TreeNode)
      setLoading(false)
      return
    }
    setApiError(['loadData', 'Сервер вернул пустой результат'])
    setLoading(false)
  }),

  loadBranch: thunk(async (actions, payload) => {
    const { setLoading, setBranchNodes } = actions
    const { id } = payload
    setLoading(true)
    const node = await getBranch(id)
    if (node?.childs) {
      setBranchNodes([id, node.childs])
    }
    setLoading(false)
  }),

  /**
   * Editing
   */
  saveChanges: thunk(async (actions, payload) => {
    const {
      setApiError,
      setOverwriteConfirmation,
      setSavedSuccessfully,
      setAddedNodeIds,
    } = actions
    const [nodes, confirmForOverwriteIds] = payload

    const apiErrorHandler = (err?: ApiError) => {
      if (err?.status !== 409) {
        const message = err?.message ?? 'Неизвестная ошибка'
        setApiError(['saveChanges', message])
      }
    }

    setSavedSuccessfully(false)
    const result = await saveTreeNodes(
      nodes,
      confirmForOverwriteIds,
      apiErrorHandler,
    ) as TreeBulkUpdateResponse

    if (result.overwriteConfirmRequired) {
      setOverwriteConfirmation(result.overwriteConfirmRequired)
      return
    }
    if (result.addedNodeIds) {
      setAddedNodeIds(result.addedNodeIds)
    }
    if (result.success) {
      setSavedSuccessfully(true)
      return
    }

    setApiError(['saveChanges', 'Не удалось сохранить изменения'])
  }),

  setSavedSuccessfully: action((state, payload) => {
    state.savedSuccessfully = payload
  }),

  setAddedNodeIds: action((state, payload) => {
    state.addedNodeIds = payload
  }),

  setOverwriteConfirmation: action((state, payload) => {
    state.confirmOverwriteIds = payload
  }),

  setApiError: action((state, payload) => {
    const [key, message] = payload
    state.apiErrors[key] = message
  }),

  clearApiErrors: action((state) => {
    state.apiErrors = {
      loadData: null,
      saveChanges: null,
    }
  }),

}
