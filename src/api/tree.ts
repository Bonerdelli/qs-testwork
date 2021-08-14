/**
 * API wrappers and handlers for Tree
 *
 * @author Nekrasov Andrew <bonerdelli@gmail.com>
 * @package qs-test-work
 */

import { TreeNode } from '../types'
import { post, put, del, isSuccessful } from '../helpers/api'

/**
 * Handle of saving local tree in the database
 */
export function saveTreeNodes(treeNodes: TreeNode[]) {
  const updatedNodes: TreeNode[] = []
  const deletedNodes: TreeNode[] = []
  const addedNodes: TreeNode[] = []

  const nodeIterator = (node: TreeNode) => {
    if (node.isDeleted) {
      deletedNodes.push(node)
    } else if (node.isNew) {
      addedNodes.push(node)
    } else if (node.isUpdated) {
      updatedNodes
  }
}

/**
 * C(R)UD endpoint handlers
 */
type UpdTreeNode = Omit<TreeNode, 'id'>

export async function addTreeNode(node: UpdTreeNode): Promise<boolean> {
  const result = await post('/tree', node)
  return isSuccessful(result)
}

export async function updateTreeNode(id: TreeNode['id'], node: UpdTreeNode): Promise<boolean> {
  const result = await put(`/tree/${id}`, node)
  return isSuccessful(result)
}

export async function deleteTreeNode(id: TreeNode['id']): Promise<boolean> {
  const result = await del(`/tree/${id}`)
  return isSuccessful(result)
}
