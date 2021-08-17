import { Action, Thunk, action, thunk } from 'easy-peasy'

import { TreeNode } from '../types'

import { getTree, getNode } from '../api/tree'

type TreeNodeMap = Record<TreeNode['id'], TreeNode>

export interface DbTreeStoreModel {
  tree?: TreeNode
  treeNodes: TreeNodeMap // For quick node getting
  isLoading: boolean
  apiError?: string

  // TODO: store expanded keys to auto-load branches

  setTree: Action<DbTreeStoreModel, TreeNode>
  reloadTree: Thunk<DbTreeStoreModel>
  setLoading: Action<DbTreeStoreModel, boolean>
  setBranchNodes: Action<DbTreeStoreModel, [TreeNode['id'], TreeNode[]]>
  loadBranch: Thunk<DbTreeStoreModel, TreeNode>
}

const treeReducer = (item: TreeNode, acc: TreeNodeMap): TreeNodeMap => {
  acc[item.id] = item
  if (item.childs) {
    item.childs.forEach(child => ({
      ...acc,
      ...treeReducer(child, acc),
    }))
  }
  return acc
}

export const dbTreeStoreModel: DbTreeStoreModel = {
  isLoading: false,
  treeNodes: {},

  setTree: action((state, tree) => {
    const treeNodes = treeReducer(tree, {})
    state.treeNodes = treeNodes
    state.tree = tree
  }),

  setBranchNodes: action((state, payload) => {
    const [id, nodes] = payload
    if (!state.tree) {
      return
    }
    // TODO: ref this
    const treeNodes = treeReducer(state.tree, {})
    if (treeNodes?.[id]) {
      treeNodes[id].childs = nodes
      delete treeNodes[id].hasChilds
    }
    state.treeNodes = {
      ...treeNodes,
      ...nodes,
    }
  }),

  setLoading: action((state, payload) => {
    state.isLoading = payload
  }),

  reloadTree: thunk(async (actions) => {
    const { setLoading, setTree } = actions
    setLoading(true)
    const tree = await getTree() // TODO: API error handling
    if (tree) {
      setTree(tree)
      setLoading(false)
    }
  }),

  loadBranch: thunk(async (actions, payload) => {
    const { setLoading, setBranchNodes } = actions
    setLoading(true)
    const { id } = payload
    const node = await getNode(id)
    if (node?.childs) {
      setBranchNodes([id, node.childs])
    }
    setLoading(false)
  }),
}
