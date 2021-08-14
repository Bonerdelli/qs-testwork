/**
 * Tree CRUD API endpoint handlers
 *
 * @author Nekrasov Andrew <bonerdelli@gmail.com>
 * @package qs-test-work
 */

const {
  TREE_ROOT_NODE_ID,
  db,
  getBranch, getSubtree,
  addItem, updateItem, deleteItem,
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
  const subtree = getSubtree(1, 2) // TODO: put it to constants
  sendJson(res, subtree)
}

const getTreeBranch = (req, res) => {
  const { nodeId } = req.params
  const branch = getBranch(nodeId)
  sendJson(res, leaf)
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

module.exports = {
  getTree,
  getTreeBranch,
  addTreeNode,
  updateTreeNode,
  deleteTreeNode,
}
