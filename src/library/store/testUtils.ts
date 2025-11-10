import { createStore, Store } from 'easy-peasy'
import { AppStoreModel } from './store'
import { cashedTreeNodesStoreModel } from './cashedTreeNodes'
import { dbTreeStoreModel } from './dbTree'
import { nodeEditModel } from './nodeEdit'
import { TreeNode } from 'library/types'

export function createMockStore(): Store<AppStoreModel> {
  return createStore<AppStoreModel>({
    dbTree: dbTreeStoreModel,
    cashedTreeNodes: cashedTreeNodesStoreModel,
    nodeEdit: nodeEditModel,
  })
}

export function createMockTreeNode(overrides?: Partial<TreeNode>): TreeNode {
  return {
    id: 1,
    value: 'Test Node',
    parent: 0,
    ...overrides,
  }
}

export function createMockTreeNodeWithChildren(
  id: number,
  parent: number,
  children: TreeNode[],
): TreeNode {
  return {
    id,
    value: `Node ${id}`,
    parent,
    childs: children,
  }
}

