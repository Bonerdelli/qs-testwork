const Database = require('better-sqlite3')
const treeData = require('../data/tree.json')

const db = new Database(':memory:')

const TREE_ROOT_NODE_ID = 1

const insertMany = (insert) => db.transaction((items) => {
  for (const item of items) insert.run(item)
})

function initDb() {
  // Create sample tree table
  db.exec('CREATE TABLE tree (id INTEGER, value TEXT, parent INTEGER)')
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

function getLeaf(id) {
  const node = getItem(id)
  const statement = db.prepare('SELECT * FROM tree WHERE parent = ?')
  const childs = statement.all(id)
  if (childs.length > 0) {
    node.childs = childs
  }
  return node
}

function getSubtree(id, maxDepth = 1) {
  const subtree = getLeaf(id)
  if (subtree.childs && maxDepth > 1) {
    subtree.childs = subtree.childs.map(item => getSubtree(item.id, maxDepth - 1))
  }
  return subtree
}

module.exports = {
  TREE_ROOT_NODE_ID,
  db,
  initDb,
  getItem,
  getLeaf,
  getSubtree,
}
