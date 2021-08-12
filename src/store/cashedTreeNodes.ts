import { Action, action } from 'easy-peasy'

import { TreeNode } from '../types'

export interface CashedTreeNodesStoreModel {
  nodes: TreeNode[]
  loadNode: Action<CashedTreeNodesStoreModel, TreeNode>
  unloadNode: Action<CashedTreeNodesStoreModel, TreeNode>
  removeNode: Action<CashedTreeNodesStoreModel, TreeNode>
  restoreNode: Action<CashedTreeNodesStoreModel, TreeNode>
  setNodeValue: Action<CashedTreeNodesStoreModel, [TreeNode, string]>
  setTree: Action<CashedTreeNodesStoreModel, TreeNode[]>
  clear: Action<CashedTreeNodesStoreModel>
}

const getNodeIndex = (
  nodes: TreeNode[], id: number,
) => nodes.findIndex(item => item.id === id)

export const cashedTreeNodesStoreModel: CashedTreeNodesStoreModel = {
  nodes: [],
  loadNode: action((state, payload) => {
    const { childs, ...node } = payload
    const index = getNodeIndex(state.nodes, node.id)
    if (index !== -1) {
      return
    }
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
      state.nodes[index] = {
        ...state.nodes[index],
        deletedAt: new Date(),
        isUpdated: true,
      }
    }
  }),
  restoreNode: action((state, payload) => {
    const { id } = payload
    const index = getNodeIndex(state.nodes, id)
    if (index !== -1) {
      state.nodes[index] = {
        ...state.nodes[index],
        deletedAt: undefined,
      }
    }
  }),
  setNodeValue: action((state, payload) => {
    const [{ id }, value] = payload
    const index = getNodeIndex(state.nodes, id)
    if (index !== -1) {
      state.nodes[index] = {
        ...state.nodes[index],
        updatedAt: new Date(),
        isUpdated: true,
        value,
      }
    }
  }),
  setTree: action((state, payload) => {
    state.nodes = payload
  }),
  clear: action((state) => {
    state.nodes = []
  }),
}
