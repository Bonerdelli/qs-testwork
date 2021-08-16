/**
 * API wrappers and handlers for Tree
 *
 * @author Nekrasov Andrew <bonerdelli@gmail.com>
 * @package qs-test-work
 */

import { TreeNode } from '../types'
import { getJson, post, put, del, isSuccessful } from '../helpers/api'

/**
 * Handle of saving local tree in the database
 */
export async function saveTreeNodes(treeNodes: TreeNode[]): Promise<boolean> {
  const updatedNodes = treeNodes.filter(node => node.isDeleted)
  const deletedNodes = treeNodes.filter(node => node.isNew)
  const addedNodes = treeNodes.filter(node => node.isUpdated)

  const result = await bulkUpdateTreeNodes({
    updatedNodes,
    deletedNodes,
    addedNodes,
  })

  if (Array.isArray(result)) {
    // TODO: add the confirmation
    return false
  }

  return !!result
}

/**
 * Get a root tree node with subtree
 */
export async function getTree(): Promise<TreeNode> {
  const result = await getJson<TreeNode>(`/tree`)
  return result as TreeNode
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
  overrideRemoteChanges?: TreeNode['id']
  updatedNodes: TreeNode[]
  deletedNodes: TreeNode[]
  addedNodes: TreeNode[]
}

export interface TreeBulkUpdateResponse {
  success: boolean
  needConfirmation?: TreeNode['id'][]
}

export async function bulkUpdateTreeNodes(request: TreeBulkUpdateRequest): Promise<boolean | TreeNode['id'][]> {
  const result = await post<TreeBulkUpdateResponse>('/tree/bulk-update', request)
  if ((result as TreeBulkUpdateResponse).needConfirmation) {
    return (result as TreeBulkUpdateResponse).needConfirmation ?? []
  }
  return isSuccessful(result)
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
