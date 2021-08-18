import { Action, action } from 'easy-peasy'

import { TreeNode } from '../types'

export interface CashedTreeNodesStoreModel {
  nodes: TreeNode[]
  lastNodeId: number
  isChanged: boolean

  loadNode: Action<CashedTreeNodesStoreModel, TreeNode>
  unloadNode: Action<CashedTreeNodesStoreModel, TreeNode>

  removeNode: Action<CashedTreeNodesStoreModel, TreeNode>
  restoreNode: Action<CashedTreeNodesStoreModel, TreeNode>
  addChildNode: Action<CashedTreeNodesStoreModel, TreeNode>
  setNodeValue: Action<CashedTreeNodesStoreModel, [TreeNode, string]>

  setUnchanged: Action<CashedTreeNodesStoreModel>
  clear: Action<CashedTreeNodesStoreModel>
}

const getNodeIndex = (
  nodes: TreeNode[], id: number,
) => nodes.findIndex(item => item.id === id)

export const cashedTreeNodesStoreModel: CashedTreeNodesStoreModel = {
  nodes: [],
  lastNodeId: 0,
  isChanged: false,

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
    state.nodes = [
      ...state.nodes,
      node,
    ]
  }),

  unloadNode: action((state, payload) => {
    const { id } = payload
    const index = getNodeIndex(state.nodes, id)
    if (index !== -1) {
      state.nodes.splice(index, 1)
      state.nodes = [
        ...state.nodes,
      ]
    }
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

  setUnchanged: action((state) => {
    state.isChanged = false
  }),

  clear: action((state) => {
    state.nodes = []
  }),
}
