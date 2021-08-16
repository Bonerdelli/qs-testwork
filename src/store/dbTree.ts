import { Action, Thunk, action, thunk } from 'easy-peasy'

import { TreeNode } from '../types'

import { getNode } from '../api/tree'

export interface DbTreeStoreModel {
  tree?: TreeNode
  isLoading: boolean
  apiError?: string

  setTree: Action<DbTreeStoreModel, TreeNode>
  reloadTree: Thunk<DbTreeStoreModel>
  setBranchNodes: Action<DbTreeStoreModel, [TreeNode['id'], TreeNode[]]>
  loadBranch: Thunk<DbTreeStoreModel, TreeNode>
}

const nodeFinder = (id: TreeNode['id']) => (node: TreeNode) => node.id === id

export const dbTreeStoreModel: DbTreeStoreModel = {
  isLoading: true,

  setTree: action((state, payload) => {
    state.tree = payload
  }),

  setBranchNodes: action((state, payload) => {
    const [ id, nodes ] = payload
    const node = state.tree?.childs?.find(nodeFinder(id)) ?? null
    if (node) {
      node.childs = nodes
    }
  }),

  loadBranch: thunk(async (actions, payload) => {
    const { id } = payload
    const node = await getNode(id)
    if (node?.childs) {
      actions.setBranchNodes([id, node.childs])
    }
  }),
}
