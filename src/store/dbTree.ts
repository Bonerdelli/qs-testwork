import { Action, action } from 'easy-peasy'

import { TreeNode } from '../types'

export interface DbTreeStoreModel {
  tree?: TreeNode[]
  setTree: Action<DbTreeStoreModel, TreeNode[]>
}

export const dbTreeStoreModel: DbTreeStoreModel = {
  tree: undefined,
  setTree: action((state, payload) => {
    state.tree = payload
  }),
}
