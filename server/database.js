const Database = require('better-sqlite3')
const treeData = require('../data/tree.json')

const db = new Database(':memory:')

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


module.exports = {
  db,
  initDb,
}
