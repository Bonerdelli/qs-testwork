import { Action, action } from 'easy-peasy'

import { TreeNode } from '../types'

export interface CashedTreeStoreModel {
  tree?: TreeNode[]
  setTree: Action<CashedTreeStoreModel, TreeNode[]>
}

export const cashedTreeStoreModel: CashedTreeStoreModel = {
  tree: undefined,
  setTree: action((state, payload) => {
    state.tree = payload
  }),
}
