const Database = require('better-sqlite3')
const treeData = require('../data/tree.json')

const db = new Database(':memory:')

const TREE_ROOT_NODE_ID = 1

const insertMany = (insert) => db.transaction((items) => {
  for (const item of items) insert.run(item)
})

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

function getItem(id) {
  const statement = db.prepare('SELECT * FROM tree WHERE id = ?')
  return statement.get(id)
}

function getBranch(id) {
  const node = getItem(id)
  const statement = db.prepare(
    'SELECT * FROM tree WHERE parent = ? AND deleted_at IS NOT NULL'
  )
  const childs = statement.all(id)
  if (childs.length > 0) {
    node.childs = childs
  }
  return node
}

function getSubtree(id, maxDepth = 1) {
  const subtree = getBranch(id)
  if (subtree.childs && maxDepth > 1) {
    subtree.childs = subtree.childs.map(item => getSubtree(item.id, maxDepth - 1))
  }
  return subtree
}

function addItem(value, parent) {
  const statement = db.prepare('INSERT INTO tree VALUES (@value, @parent)')
  statement.run({ value, id })
}

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
