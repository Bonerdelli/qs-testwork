import { Action, action } from 'easy-peasy'

import { TreeNode } from '../types'

export interface NodeEditStoreModel {
  activeId?: TreeNode['id'] | undefined
  setActiveId: Action<NodeEditStoreModel, TreeNode['id'] | undefined>
}

export const nodeEditModel: NodeEditStoreModel = {
  activeId: undefined,
  setActiveId: action((state, payload) => {
    state.activeId = payload
  }),
}
