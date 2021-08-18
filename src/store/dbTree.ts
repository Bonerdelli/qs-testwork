import { Action, Thunk, action, thunk } from 'easy-peasy'

import { TreeBulkUpdateResponse, saveTreeNodes, getTree, getBranch } from '../api/tree'
import { ApiErrorResponse } from '../helpers/api'

import { TreeNode } from '../types'

type TreeNodeMap = Record<TreeNode['id'], TreeNode>
type ApiErrorTypes = 'loadData' | 'saveChanges'

export interface DbTreeStoreModel {
  tree?: TreeNode
  treeNodes: TreeNodeMap // For quick node getting
  isLoading: boolean

  confirmOverwriteIds?: TreeNode['id'][]
  apiErrors: Record<ApiErrorTypes, string | null>

  // Data retrieving
  setTree: Action<DbTreeStoreModel, TreeNode>
  reloadTree: Thunk<DbTreeStoreModel>
  setLoading: Action<DbTreeStoreModel, boolean>
  setBranchNodes: Action<DbTreeStoreModel, [TreeNode['id'], TreeNode[]]>
  loadBranch: Thunk<DbTreeStoreModel, TreeNode>

  // Editing
  saveChanges: Thunk<DbTreeStoreModel, TreeNode[]>
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
    setLoading(true)
    const { id } = payload
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
    const { setApiError, setOverwriteConfirmation } = actions
    const result = await saveTreeNodes(payload)
    if ((result as ApiErrorResponse)?.error) {
      const message = (result as ApiErrorResponse)?.error.message ?? 'Неизвестная ошибка'
      setApiError(['saveChanges', message])
      return
    }
    const typedResult = result as TreeBulkUpdateResponse
    if (typedResult.success) {
      return
    }
    if (typedResult.overwriteConfirmRequired) {
      setOverwriteConfirmation(typedResult.overwriteConfirmRequired)
      return
    }
    setApiError(['saveChanges', 'Не удалось сохранить изменения'])
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
