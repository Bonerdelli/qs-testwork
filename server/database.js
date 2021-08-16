/**
 * Handling of sample database
 *
 * @author Nekrasov Andrew <bonerdelli@gmail.com>
 * @package qs-test-work
 */

const Database = require('better-sqlite3')
const treeData = require('../data/tree.json')
const { TREE_ROOT_NODE_ID } = require('../config')

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
    'updated_at NUMERIC DEFAULT CURRENT_TIMESTAMP, ' +
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
 * Retrieve one item by identifier
 * @param {number} id – Node identifier
 * @return TreeNode
 */
function getItem(id) {
  const statement = db.prepare('SELECT * FROM tree WHERE id = ?')
  return statement.get(id)
}

/**
 * Retrieve tree branch by identifier
 * @param {number} id – Node identifier
 * @return TreeNode
 */
function getBranch(id) {
  const node = getItem(id)
  const statement = db.prepare(
    'SELECT * FROM tree WHERE parent = ? AND deleted_at IS NULL'
  )
  const childs = statement.all(id)
  if (childs.length > 0) {
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
function getSubtree(id, maxDepth = 1) {
  const subtree = getBranch(id)
  if (!subtree.childs) {
    return subtree
  }
  if (maxDepth > 2) {
    // NOTE: I suppose to use Nested Sets to prevent extra queries
    subtree.childs = subtree.childs.map(item => getSubtree(item.id, maxDepth - 1))
  } else {
    // Check if each of child node has childs
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
    'SELECT COUNT(*) as count FROM tree WHERE parent = ? AND deleted_at IS NULL'
  )
  const result = statement.get(id)
  return result.count > 0
}

/**
 * Get update datetimes of given node ids
 * @param {number[]} ids – Node identifiers
 * @return Date[]
 */
function getNodesUpdatedDateTime(ids) {
  const statement = db.prepare('SELECT * FROM tree WHERE id IN(?)')
  statement.all(ids.join(','))
}

/**
 * Editing...
 */

function updateItem(id, value, isDeleted) {
  const statement = db.prepare('UPDATE tree SET @value = @value WHERE id = @id')
  statement.run({ value, id })
}

function deleteItem(id) {
  const statement = db.prepare(
    'UPDATE tree SET deleted_at = DATETIME(\'now\') WHERE id = @id'
  )
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
  db,
  initDb,
  getItem,
  getBranch,
  getSubtree,
}
