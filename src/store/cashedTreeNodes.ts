import { Action, action } from 'easy-peasy'

import { TreeNode } from '../types'

export interface CashedTreeNodesStoreModel {
  nodes: TreeNode[]
  addNode: Action<CashedTreeNodesStoreModel, TreeNode>
  removeNode: Action<CashedTreeNodesStoreModel, TreeNode>
  setTree: Action<CashedTreeNodesStoreModel, TreeNode[]>
}

export const cashedTreeNodesStoreModel: CashedTreeNodesStoreModel = {
  nodes: [],
  addNode: action((state, payload) => {
    const { childs, ...node } = payload
    state.nodes = [
      ...state.nodes,
      node,
    ]
  }),
  removeNode: action((state, payload) => {
    const { id } = payload
    const index = state.nodes.findIndex(item => item.id === id)
    if (index !== -1) {
      state.nodes.splice(index, 1)
    }
  }),
  setTree: action((state, payload) => {
    state.nodes = payload
  }),
}
