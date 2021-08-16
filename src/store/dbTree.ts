import { Action, Thunk, action, thunk } from 'easy-peasy'

import { TreeNode } from '../types'

import { getNode } from '../api/tree'

export interface DbTreeStoreModel {
  tree?: TreeNode[]
  setTree: Action<DbTreeStoreModel, TreeNode[]>
  setNodes: Action<DbTreeStoreModel, TreeNode[]>
  loadBranch: Thunk<DbTreeStoreModel, TreeNode>
}

export const dbTreeStoreModel: DbTreeStoreModel = {
  tree: undefined,
  setTree: action((state, payload) => {
    state.tree = payload
  }),
  setNodes: action((state, payload) => {
    state.tree = [
      ...state.tree ?? [],
      ...payload,
    ]
  }),
  loadBranch: thunk(async (actions, payload) => {
    const { id } = payload
    const node = await getNode(id)
    if (node?.childs) {
      actions.setNodes(node.childs)
    }
  }),
}
