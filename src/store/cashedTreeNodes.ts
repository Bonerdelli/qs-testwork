import { Action, action } from 'easy-peasy'

import { TreeNode } from '../types'

export interface CashedTreeNodesStoreModel {
  nodes: TreeNode[]
  maxNodeId: number

  loadNode: Action<CashedTreeNodesStoreModel, TreeNode>
  unloadNode: Action<CashedTreeNodesStoreModel, TreeNode>

  removeNode: Action<CashedTreeNodesStoreModel, TreeNode>
  restoreNode: Action<CashedTreeNodesStoreModel, TreeNode>
  addChildNode: Action<CashedTreeNodesStoreModel, TreeNode>
  setNodeValue: Action<CashedTreeNodesStoreModel, [TreeNode, string]>

  clear: Action<CashedTreeNodesStoreModel>
}

const getNodeIndex = (
  nodes: TreeNode[], id: number,
) => nodes.findIndex(item => item.id === id)

export const cashedTreeNodesStoreModel: CashedTreeNodesStoreModel = {
  nodes: [],
  maxNodeId: 0,

  loadNode: action((state, payload) => {
    const { childs, ...node } = payload
    const index = getNodeIndex(state.nodes, node.id)
    if (index !== -1) {
      return
    }
    if (node.id > state.maxNodeId) {
      state.maxNodeId = node.id
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
        isDeleted: true,
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

  addChildNode: action((state, payload) => {
    const { id } = payload
    const { maxNodeId } = state
    const index = getNodeIndex(state.nodes, id)
    if (index !== -1) {
      ++state.maxNodeId
      state.nodes.push({
        id: maxNodeId + 1,
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
      state.nodes[index] = {
        ...state.nodes[index],
        updatedAt: new Date(),
        isUpdated: true,
        value,
      }
    }
  }),

  clear: action((state) => {
    state.nodes = []
  }),
}
