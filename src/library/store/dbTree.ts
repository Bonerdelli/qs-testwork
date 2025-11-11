/**
 * Tree database application state
 *
 * @author Nekrasov Andrew <bonerdelli@gmail.com>
 * @package qs-test-work
 */

import { Action, Thunk, action, thunk } from 'easy-peasy'

import {
  ApiError,
  ApiErrorResponse,
  ApiSuccessResponse,
} from 'library/helpers/api'
import {
  TreeBulkUpdateResponse,
  saveTreeNodes,
  getTree,
  getBranch,
  resetTreeData,
} from 'library/api/tree'

import { TreeNode } from 'library/types'

type TreeNodeMap = Record<TreeNode['id'], TreeNode>
type ApiErrorTypes = 'loadData' | 'saveChanges' | 'resetTree'

export interface DbTreeStoreModel {
  tree?: TreeNode
  treeNodes: TreeNodeMap // For quick node getting
  expandedKeys: TreeNode['id'][]

  isLoading: boolean
  savedSuccessfully?: boolean
  apiErrors: Record<ApiErrorTypes, string | null>
  confirmOverwriteIds?: TreeNode['id'][]
  addedNodeIds?: TreeNode['id'][]

  // Data retrieving
  setTree: Action<DbTreeStoreModel, TreeNode>
  reloadTree: Thunk<DbTreeStoreModel>
  resetTreeData: Thunk<DbTreeStoreModel>
  setLoading: Action<DbTreeStoreModel, boolean>
  setBranchNodes: Action<DbTreeStoreModel, [TreeNode['id'], TreeNode[]]>
  setExpandedKeys: Action<DbTreeStoreModel, TreeNode['id'][]>
  loadBranch: Thunk<DbTreeStoreModel, TreeNode>
  clear: Action<DbTreeStoreModel>

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
  expandedKeys: [],

  apiErrors: {
    loadData: null,
    saveChanges: null,
    resetTree: null,
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
    const treeNodes = treeReducer(state.tree, {})
    if (treeNodes?.[id]) {
      treeNodes[id].childs = nodes
      delete treeNodes[id].hasChilds
    }
    // Convert nodes array to map and merge with treeNodes
    const nodesMap = nodes.reduce((acc, node) => {
      acc[node.id] = node
      return acc
    }, {} as TreeNodeMap)
    // Merge treeNodes with nodesMap, preserving the modified treeNodes[id] with childs
    state.treeNodes = {
      ...treeNodes,
      ...nodesMap,
      [id]: treeNodes[id], // Ensure the modified node with childs is preserved
    }
  }),

  setLoading: action((state, payload) => {
    state.isLoading = payload
  }),

  reloadTree: thunk(async (actions) => {
    const {
      setLoading,
      setApiError,
      clear,
      setTree,
    } = actions
    setApiError(['loadData', null])
    setLoading(true)
    clear()
    const result = await getTree()
    if ((result as ApiErrorResponse)?.error) {
      setApiError(['loadData', (result as ApiErrorResponse).error.message])
      setLoading(false)
      return false
    }
    if (result) {
      setTree(result as TreeNode)
      setLoading(false)
      return true
    }
    setApiError(['loadData', 'Сервер вернул пустой результат'])
    setLoading(false)
    return false
  }),

  resetTreeData: thunk(async (actions) => {
    const { setLoading, setApiError, reloadTree } = actions
    setApiError(['resetTree', null])
    setLoading(true)
    const result = await resetTreeData()
    if ((result as ApiErrorResponse)?.error) {
      setApiError(['resetTree', (result as ApiErrorResponse).error.message])
      setLoading(false)
      return false
    }
    if ((result as ApiSuccessResponse)?.success) {
      await reloadTree()
      return true
    }
    setApiError(['resetTree', 'Сервер вернул пустой результат'])
    setLoading(false)
    return false
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
      setOverwriteConfirmation([])
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

  setExpandedKeys: action((state, payload) => {
    state.expandedKeys = payload
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
      resetTree: null,
    }
  }),

  clear: action((state) => {
    state.tree = undefined
    state.expandedKeys = []
  }),

}
