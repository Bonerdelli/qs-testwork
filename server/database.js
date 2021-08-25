/**
 * Handling of sample database
 *
 * @author Nekrasov Andrew <bonerdelli@gmail.com>
 * @package qs-test-work
 */

const Database = require('better-sqlite3')
const treeData = require('../data/tree.json')
const { TREE_ROOT_NODE_ID } = require('../config')

const ADD_ITEM_SQL_TEMPLATE = 'INSERT INTO tree (parent, value) VALUES (@parent, @value)'
const UPDATE_ITEM_SQL_TEMPLATE = 'UPDATE tree SET value = @value, deleted_at = @deleted_at, updated_at = DATETIME(\'now\') WHERE id = @id'
const DELETE_ITEM_SQL_TEMPLATE = 'UPDATE tree SET deleted_at = DATETIME(\'now\') WHERE id = @id'

const db = new Database(':memory:')

const insertMany = (insert) => db.transaction((items) => {
  for (const item of items) insert.run(item)
})

/**
 * Initialize database with test data
 * Called when development server starts
 */
function initDb() {
  // Create sample tree table
  db.exec('CREATE TABLE tree (' +
    'id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, ' +
    'value TEXT, ' +
    'parent INTEGER, ' +
    // NOTE: NUMERIC is recommend SQLite type affinity for Date types
    'updated_at NUMERIC DEFAULT (DATETIME(\'now\')), ' + // NOTE: do not set updated time by default
    'deleted_at NUMERIC DEFAULT NULL' +
  ')')
  // Insert sample data
  const insert = db.prepare(
    'INSERT INTO tree(id, value, parent) ' +
    'VALUES (@id, @value, @parent)'
  )
  insertMany(insert)(treeData)
}

/**
 * Delete database tables
 */
function cleanDb() {
  db.exec('DROP TABLE tree')
}

/**
 * Retrieve one item by identifier
 * @param {number} id – Node identifier
 * @return TreeNode
 */
function getItem(id) {
  const statement = db.prepare('SELECT * FROM tree WHERE id = ?')
  return statement.get(id)
}

/**
 * Retrieve parent of given item by identifier
 * @param {number} id – Node identifier
 * @return TreeNode
 */
function getParentItem(id) {
  const statement = db.prepare('SELECT * FROM tree WHERE parent = ?')
  return statement.get(id)
}

/**
 * Retrieve a couple of items by identifiers
 * @param {number} id – Node identifier
 * @return TreeNode
 */
function getItems(ids, checkIsBranchDeleted = true, includeDeleted = false) {
  const idsValue = ids.map(id => +id).join(',')
  const sql = `SELECT * FROM tree WHERE id IN (${idsValue})`
  const statement = db.prepare(sql)
  let items = statement.all()
  if (checkIsBranchDeleted) {
    // NOTE: there is no simple mapping to prevent unnecessary checkings
    // e.g. when checking nodes in one branch
    let deletedParentIds = []
    const parentIds = items
      .map(item => item.parent)
      .filter((item, id, array) => array.indexOf(item) === id)

    parentIds.forEach((parentId) => {
      if (isBranchDeleted(parentId)) {
        deletedParentIds.push(parentId)
      }
    })
    if (deletedParentIds.length) {
      deletedParentIds.forEach((deletedParentId) => {
        items
          .filter(item => item.parent === deletedParentId)
          .forEach(item => (item.is_parent_deleted = true))
      })
    }
  }
  if (!includeDeleted) {
    items = items.filter(item => !item.deleted_at && !item.is_parent_deleted)
  }
  return items
}

/**
 * Retrieve tree branch by identifier
 * @param {number} id – Node identifier
 * @return TreeNode
 */
function getBranch(id, disabled = false) {
  const node = getItem(id)
  const statement = db.prepare(
    'SELECT * FROM tree WHERE parent = ?'
  )
  const childs = statement.all(id)
  if (node.deleted_at || disabled || isBranchDeleted(id)) {
    childs.forEach(item => (item.is_parent_deleted = true))
  }
  if (childs.length > 0) {
    childs.forEach(item => item.hasChilds = isNodeHasChilds(item.id))
    node.childs = childs
  }
  return node
}

/**
 * Retrieve subtree with given depth starts from given node
 * @param {number} id – Node identifier
 * @param {number} maxDepth – Maximum levels for retrieve
 * @return TreeNode
 */
function getSubtree(id, maxDepth = 1, disabled = false) {
  const subtree = getBranch(id, disabled)
  if (!subtree.childs) {
    return subtree
  }
  if (maxDepth > 2) {
    subtree.childs.forEach((item) => {
      // NOTE: Not optimal, I suppose to use Nested Sets for sttore tree data
      const branch = getSubtree(
        item.id,
        maxDepth - 1,
        item.is_parent_deleted || item.deleted_at,
      )
      if (branch.childs) {
        item.childs = branch.childs
      }
    })
  } else {
    // Check for each of child node that it has childs
    subtree.childs.forEach(item => item.hasChilds = isNodeHasChilds(item.id))
  }
  return subtree
}

/**
 * Checks is given node has at least one child
 * NOTE: I suppose to use Nested Sets to prevent unnecessary queries
 *
 * @param {number} id – Node identifier
 * @param {number} maxDepth – Maximum levels for retrieve
 * @return TreeNode
 */
function isNodeHasChilds(id) {
  const statement = db.prepare(
    'SELECT COUNT(*) as count FROM tree WHERE parent = ?'
  )
  const result = statement.get(id)
  return result.count > 0
}

/**
 * Check is parent of given node has deleted
 * NOTE: I suppose to use Nested Sets to prevent unnecessary queries
 *
 * @param {number} id – Child node identifier
 * @return boolean
 */
function isParentDeleted(id) {
  const statement = db.prepare(
    'SELECT deleted_at FROM tree WHERE parent = ?'
  )
  const result = statement.get(id)
  return result.deleted_at !== null
}

/**
 * Check is branch contains given node has deleted,
 * i.e. any parent has deleted state
 *
 * NOTE: I suppose to use Nested Sets to prevent unnecessary queries
 *
 * @param {number} id – Node identifier
 * @return boolean
 */
function isBranchDeleted(id) {
  let branchDeleted = false
  const checkIsDeleted = (id) => {
    const node = getItem(id)
    if (!node) {
      return false
    }
    if (node.deleted_at !== null) {
      return true
    }
    if (node.parent !== TREE_ROOT_NODE_ID) {
      return checkIsDeleted(node.parent)
    }
  }
  return checkIsDeleted(id)
}

/**
 * Get update datetimes of given node ids
 * @param {number[]} ids – Node identifiers
 * @return Date[]
 */
function getNodesUpdatedDateTime(ids) {
  const idsValue = ids.map(id => +id).join(',')
  const sql = `SELECT id, updated_at FROM tree WHERE id IN (${idsValue})`
  const statement = db.prepare(sql)
  return statement.all()
}

/**
 * Execute bulk editing of nodes in a single transaction
 * @return number[] Identifiers of newly inserted nodes
 */
function executeBulkEditing(updatedNodes, deletedNodes, addedNodes) {
  const addedNodeIds = {}
  addedNodes.sort((a, b) => a.id - b.id)
  const addStatement = db.prepare(ADD_ITEM_SQL_TEMPLATE)
  const updateStatement = db.prepare(UPDATE_ITEM_SQL_TEMPLATE)
  const deleteStatement = db.prepare(DELETE_ITEM_SQL_TEMPLATE)
  const bulkUpdate = db.transaction(() => {
    for (const node of addedNodes) {
      const theirId = node.id
      delete node.id
      if (addedNodeIds[node.parent] !== undefined) {
        node.parent = addedNodeIds[node.parent]
      }
      const info = addStatement.run(node)
      addedNodeIds[theirId] = info.lastInsertRowid
    }
    for (const node of updatedNodes) updateStatement.run(node)
    for (const node of deletedNodes) deleteStatement.run(node)
  })
  bulkUpdate()
  return Object.values(addedNodeIds)
}

/**
 * Editing one by one...
 * NOTE: actually this fns aren't used
 */

function addItem(parent, value) {
  const statement = db.prepare(ADD_ITEM_SQL_TEMPLATE)
  statement.run({ parent, value })
}

function updateItem(id, value, isDeleted) {
  const statement = db.prepare(UPDATE_ITEM_SQL_TEMPLATE)
  statement.run({ value, id })
}

function deleteItem(id) {
  const statement = db.prepare(DELETE_ITEM_SQL_TEMPLATE)
  statement.run({ id })
}

function restoreItem(id) {
  const statement = db.prepare(
    'UPDATE tree SET deleted_at = NULL WHERE id = @id'
  )
  statement.run({ id })
}

module.exports = {
  TREE_ROOT_NODE_ID,
  initDb,
  cleanDb,
  db,

  getItem,
  getItems,
  getBranch,
  getSubtree,

  addItem,
  updateItem,
  deleteItem,
  restoreItem,

  getNodesUpdatedDateTime,
  executeBulkEditing,
}
