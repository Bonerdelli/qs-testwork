/**
 * API wrappers and handlers for Tree
 *
 * @author Nekrasov Andrew <bonerdelli@gmail.com>
 * @package qs-test-work
 */

import { TreeNode } from '../types'
import { ApiErrorResponse, getJson, post, put, del, isSuccessful } from '../helpers/api'

/**
 * Handle of saving local tree in the database
 */
export async function saveTreeNodes(treeNodes: TreeNode[]): Promise<TreeBulkUpdateResponse | ApiErrorResponse> {
  const updatedNodes = treeNodes.filter(n => n.isUpdated && !n.isDeleted && !n.isNew)
  const deletedNodes = treeNodes.filter(n => n.isDeleted)
  const addedNodes = treeNodes.filter(n => n.isNew)
  const payload = {
    updatedNodes,
    deletedNodes,
    addedNodes,
  }

  const result = await post<TreeBulkUpdateResponse>('/tree/bulk-update', payload)
  console.log('saveTreeNodes result', result)
  return result
}

/**
 * Get a root tree node with subtree
 */
export async function getTree(): Promise<TreeNode | ApiErrorResponse> {
  const result = await getJson<TreeNode>('/tree')
  return result
}

/**
 * Get a single tree node with childs
 */
export async function getNode(id: TreeNode['id']): Promise<TreeNode> {
  const result = await getJson<TreeNode>(`/tree/${id}`)
  return result as TreeNode
}

/**
 * Handling of bulk updates
 */

export interface TreeBulkUpdateRequest {
  overwriteRemoteChanges?: TreeNode['id']
  updatedNodes: TreeNode[]
  deletedNodes: TreeNode[]
  addedNodes: TreeNode[]
}

export interface TreeBulkUpdateResponse {
  success: boolean
  overwriteConfirmRequired?: TreeNode['id'][]
}

/**
 * C(R)UD endpoint handlers
 * NOTE: not used currently, I implemented this before using bulk update function
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
