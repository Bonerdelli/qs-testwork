/**
 * Handler functions for Tree CRUD API endpoints
 *
 * @author Nekrasov Andrew <bonerdelli@gmail.com>
 * @package qs-test-work
 */

const { TREE_ROOT_NODE_ID, TREE_MAX_INITIAL_DEPTH } = require('../config')

const {
  db,
  getItems: dbGetItems,
  getBranch: dbGetBranch,
  getSubtree: dbGetSubtree,
  addItem: dbAddItem,
  updateItem: dbUpdateItem,
  deleteItem: dbDeleteItem,
  getNodesUpdatedDateTime,
  executeBulkEditing,
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
  const subtree = dbGetSubtree(TREE_ROOT_NODE_ID, TREE_MAX_INITIAL_DEPTH)
  sendJson(res, subtree)
}

const getTreeNodes = (req, res) => {
  const { ids } = req.body
  const nodes = dbGetItems(ids)
  sendJson(res, nodes)
}

const getTreeBranch = (req, res) => {
  const { id } = req.params
  const branch = dbGetBranch(id)
  sendJson(res, branch)
}

const addTreeNode = (req, res) => {
  const { parent, value } = req.body
  try {
    dbAddItem(parent, value)
  } catch(e) {
    return handleApiError(res, e)
  }
  sendJson(res, { success: true })
}

const updateTreeNode = (req, res) => {
  const { nodeId } = req.params
  const { value } = req.body
  try {
    dbUpdateItem(nodeId, value)
  } catch(e) {
    return handleApiError(res, e)
  }
  sendJson(res, { success: true })
}

const deleteTreeNode = (req, res) => {
  const { nodeId } = req.params
  try {
    dbDeleteItem(nodeId)
  } catch(e) {
    return handleApiError(res, e)
  }
  sendJson(res, { success: true })
}

const bulkUpdateTreeNodes = async (req, res) => {
  const {
    confirmForOverwriteIds = [],
    updatedNodes,
    deletedNodes,
    addedNodes,
  } = req.body

  let overwriteConfirmRequired = []
  if (updatedNodes.length) {
    // Check if confirmation to override changes needed
    const updatedNodeIds = updatedNodes.map(node => node.id)
    const nodesUpdatedAt = getNodesUpdatedDateTime(updatedNodeIds)

    overwriteConfirmRequired = updatedNodes
      .filter((node, index) => node.updated_at !== nodesUpdatedAt[index])
      .map(node => node.id)
      .filter(id => !confirmForOverwriteIds.includes(id))
  }

  if (overwriteConfirmRequired.length > 0) {
    return sendJson(res, {
      success: false,
      overwriteConfirmRequired,
    })
  }

  let addedNodeIds
  try {
    addedNodeIds = executeBulkEditing(updatedNodes, deletedNodes, addedNodes)
  } catch (e) {
    return handleApiError(res, e)
  }

  sendJson(res, {
    success: true,
    addedNodeIds,
  })

}

module.exports = {
  getTree,
  getTreeBranch,
  getTreeNodes,

  addTreeNode,
  updateTreeNode,
  deleteTreeNode,

  bulkUpdateTreeNodes,
}
