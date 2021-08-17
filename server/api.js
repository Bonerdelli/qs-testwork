/**
 * Handlers of Tree CRUD API endpoints
 *
 * @author Nekrasov Andrew <bonerdelli@gmail.com>
 * @package qs-test-work
 */

const { TREE_ROOT_NODE_ID, TREE_MAX_INITIAL_DEPTH } = require('../config')

const {
  db,
  getBranch, getSubtree,
  addItem, updateItem, deleteItem,
  getNodesUpdatedDateTime,
} = require('./database')

const sendJson = (res, data, status) => {
  res.setHeader('Content-Type', 'application/json')
  if (status) {
    res.status(status)
  }
  res.send(JSON.stringify(data))
}

const handleApiError = (res, error) => {
  const { message, code } = error
  sendJson(res, { message, code }, 500)
}

const getTree = (req, res) => {
  const subtree = getSubtree(TREE_ROOT_NODE_ID, TREE_MAX_INITIAL_DEPTH)
  sendJson(res, subtree)
}

const getTreeBranch = (req, res) => {
  const { id } = req.params
  const branch = getBranch(id)
  sendJson(res, branch)
}

const addTreeNode = (req, res) => {
  const { parent, value } = req.body
  try {
    addItem(parent, value)
  } catch(e) {
    return handleApiError(res, e)
  }
  sendJson(res, { success: true })
}

const updateTreeNode = (req, res) => {
  const { nodeId } = req.params
  const { value } = req.body
  try {
    updateItem(nodeId, value)
  } catch(e) {
    return handleApiError(res, e)
  }
  sendJson(res, { success: true })
}

const deleteTreeNode = (req, res) => {
  const { nodeId } = req.params
  try {
    deleteItem(nodeId)
  } catch(e) {
    return handleApiError(res, e)
  }
  sendJson(res, { success: true })
}

const bulkUpdateTreeNodes = async (req, res) => {
  const {
    overrideRemoteChanges,
    updatedNodes,
    deletedNodes,
    addedNodes,
  } = req.body
  let needConfirmationNodeId = null

  console.log('bulkUpdateTreeNodes: start')

  // Check if confirmation to override changes needed
  const updatedNodeIds = updatedNodes.map(node => node.id)
  console.log('updatedNodeIds', updatedNodeIds)
  if (updatedNodeIds.length) {
    const nodesUpdatedAt = getNodesUpdatedDateTime(updatedNodeIds)
    console.log('nodesUpdatedAt', nodesUpdatedAt)
  }

  console.log('bulkUpdateTreeNodes: finish')

  return false

}

module.exports = {
  getTree,
  getTreeBranch,
  bulkUpdateTreeNodes,
  addTreeNode,
  updateTreeNode,
  deleteTreeNode,
}
