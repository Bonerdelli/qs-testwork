/**
 * API wrappers and handlers for Tree
 *
 * @author Nekrasov Andrew <bonerdelli@gmail.com>
 * @package qs-test-work
 */

import { TreeNode } from 'library/types'
import {
  ApiErrorResponse,
  ApiSuccessResponse,
  ApiError,
  getJson,
  post,
  put,
  del,
  isSuccessful,
} from 'library/helpers/api'

/**
 * Get a root tree node with subtree
 */
export async function getTree(): Promise<TreeNode | ApiErrorResponse> {
  const result = await getJson<TreeNode>('/tree')
  return result
}

/**
 * Get a tree branch (node with childs)
 */
export async function getBranch(id: TreeNode['id']): Promise<TreeNode> {
  const result = await getJson<TreeNode>(`/tree/branch/${id}`)
  return result as TreeNode
}

/**
 * Get a single node (without childs)
 */
export async function getNode(id: TreeNode['id']): Promise<TreeNode> {
  const result = await getJson<TreeNode>(`/tree/node/${id}`)
  return result as TreeNode
}

/**
 * Get nodes by ids without childs
 */
export async function getNodes(ids: TreeNode['id'][]): Promise<TreeNode[] | ApiErrorResponse> {
  return post<TreeNode[]>('/tree/nodes', { ids })
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
  addedNodeIds?: TreeNode['id'][]
  overwriteConfirmRequired?: TreeNode['id'][]
}

export async function saveTreeNodes(
  treeNodes: TreeNode[],
  confirmForOverwriteIds?: TreeNode['id'][],
  errorHandler?: (error?: ApiError) => void,
): Promise<TreeBulkUpdateResponse | ApiErrorResponse> {
  const nodesToUpdate = treeNodes.filter(n => n.value && (n.isUpdated || n.isDeleted))
  const updatedNodes = nodesToUpdate.filter(n => n.isUpdated && !n.isDeleted && !n.isNew)
  const deletedNodes = nodesToUpdate.filter(n => n.isDeleted)
  const addedNodes = nodesToUpdate.filter(n => n.isNew)
  const payload = {
    confirmForOverwriteIds,
    updatedNodes,
    deletedNodes,
    addedNodes,
  }

  const result = await post<TreeBulkUpdateResponse>(
    '/tree/bulk-update',
    payload,
    errorHandler,
  )

  return result
}

/**
 * Reset tree database to initial state
 */
export async function resetTreeData(): Promise<ApiSuccessResponse | ApiErrorResponse> {
  const result = await getJson<ApiSuccessResponse>('/tree/reset-data')
  return result
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
