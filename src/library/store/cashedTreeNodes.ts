import { Action, Thunk, action, thunk } from 'easy-peasy'

import { TreeNode } from 'library/types'
import { ApiErrorResponse } from 'library/helpers/api'
import { getNodes } from 'library/api/tree'

export interface CashedTreeNodesStoreModel {
  nodes: TreeNode[]
  nodeIds: TreeNode['id'][]
  lastNodeId: number
  isChanged: boolean
  isLoading: boolean
  apiError: string | null

  loadNode: Action<CashedTreeNodesStoreModel, TreeNode>
  reloadNode: Action<CashedTreeNodesStoreModel, TreeNode>
  unloadNode: Action<CashedTreeNodesStoreModel, TreeNode>
  clearAddedAndDeleted: Action<CashedTreeNodesStoreModel>
  refreshNodesById: Thunk<CashedTreeNodesStoreModel, TreeNode['id'][]>
  setLoading: Action<CashedTreeNodesStoreModel, boolean>

  removeNode: Action<CashedTreeNodesStoreModel, TreeNode>
  restoreNode: Action<CashedTreeNodesStoreModel, TreeNode>
  addChildNode: Action<CashedTreeNodesStoreModel, TreeNode>
  setNodeValue: Action<CashedTreeNodesStoreModel, [TreeNode, string]>

  setApiError: Action<CashedTreeNodesStoreModel, string | null>
  setUnchanged: Action<CashedTreeNodesStoreModel>
  clear: Action<CashedTreeNodesStoreModel>
}

const getNodeIndex = (
  nodes: TreeNode[], id: number,
) => nodes.findIndex(item => item.id === id)

export const cashedTreeNodesStoreModel: CashedTreeNodesStoreModel = {
  nodes: [],
  nodeIds: [],
  lastNodeId: 0,
  isLoading: false,
  isChanged: false,
  apiError: null,

  loadNode: action((state, payload) => {
    const { childs, ...node } = payload
    const index = getNodeIndex(state.nodes, node.id)
    if (index !== -1) {
      return
    }
    if (node.id > state.lastNodeId) {
      state.lastNodeId = node.id
    }
    delete node.hasChilds
    state.nodes.push(node)
    state.nodeIds.push(node.id)
  }),

  reloadNode: action((state, payload) => {
    const { childs, ...node } = payload
    const index = getNodeIndex(state.nodes, node.id)
    if (node.id > state.lastNodeId) {
      state.lastNodeId = node.id
    }
    delete node.hasChilds
    if (index === -1) {
      state.nodes.push(node)
      state.nodeIds.push(node.id)
    } else {
      state.nodes[index] = node
      state.nodeIds[index] = node.id
    }
  }),

  unloadNode: action((state, payload) => {
    const { id } = payload
    const index = getNodeIndex(state.nodes, id)
    if (index !== -1) {
      state.nodes.splice(index, 1)
      state.nodeIds.splice(index, 1)
      state.nodes = [
        ...state.nodes,
      ]
    }
  }),

  clearAddedAndDeleted: action((state) => {
    const cleared = state.nodes.filter(node => !node.isNew && !node.isDeleted)
    state.nodeIds = cleared.map(node => node.id)
    state.nodes = cleared
  }),

  refreshNodesById: thunk(async (actions, payload) => {
    const {
      setApiError,
      reloadNode,
      setUnchanged,
      setLoading,
    } = actions
    setLoading(true)
    setApiError(null)
    const result = await getNodes(payload)
    if ((result as ApiErrorResponse).error) {
      setApiError((result as ApiErrorResponse).error.message)
      setLoading(false)
      return
    }
    if (Array.isArray(result)) {
      result.forEach(node => reloadNode(node))
      setUnchanged()
      setTimeout(() => setLoading(false)) // Sorry
      return
    }
    setApiError('Сервер вернул пустой результат')
    setLoading(false)
  }),

  removeNode: action((state, payload) => {
    const { id } = payload
    const index = getNodeIndex(state.nodes, id)
    if (index !== -1) {
      state.isChanged = true
      state.nodes[index] = {
        ...state.nodes[index],
        deletedAt: new Date(),
        isDeleted: true,
      }
    }
  }),

  restoreNode: action((state, payload) => {
    const { id } = payload
    const index = getNodeIndex(state.nodes, id)
    if (index !== -1) {
      state.isChanged = true
      state.nodes[index] = {
        ...state.nodes[index],
        deletedAt: undefined,
      }
    }
  }),

  addChildNode: action((state, payload) => {
    const { id } = payload
    const { lastNodeId } = state
    const index = getNodeIndex(state.nodes, id)
    if (index !== -1) {
      state.isChanged = true
      ++state.lastNodeId
      state.nodeIds.push(lastNodeId + 1)
      state.nodes.push({
        id: lastNodeId + 1,
        parent: id,
        value: '',
        isNew: true,
      })
    }
  }),

  setNodeValue: action((state, payload) => {
    const [{ id }, value] = payload
    const index = getNodeIndex(state.nodes, id)
    if (index !== -1) {
      state.isChanged = true
      state.nodes[index] = {
        ...state.nodes[index],
        updatedAt: new Date(),
        isUpdated: true,
        value,
      }
    }
  }),

  setApiError: action((state, payload) => {
    state.apiError = payload
  }),

  setLoading: action((state, payload) => {
    state.isLoading = payload
  }),

  setUnchanged: action((state) => {
    state.isChanged = false
  }),

  clear: action((state) => {
    state.nodes = []
    state.nodeIds = []
  }),
}
