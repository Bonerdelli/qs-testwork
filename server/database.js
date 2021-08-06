const sqlite = require('sqlite3')
const { open } = require('sqlite')

const data = require('../data/tree.json')

let db
async function initializeDb() {
  db = await open({
    filename: ':memory:',
    driver: sqlite.Database,
  })
  await db.serialize(() => {
    // Create sample tree table
    db.exec('CREATE TABLE tree (id INTEGER, value TEXT, parent INTEGER)')
    // Insert sample data
    db.run('BEGIN TRANSACTION')
    data.forEach(item => db.run(
      'INSERT INTO tree(id, value, parent) ' +
      'VALUES (:id, :value, :parent)', {
        ':id': item.id,
        ':value': item.value,
        ':parent': item.parent,
      }
    ))
    db.run('COMMIT')
  })
  const test = await
}


module.exports = {
  db,
  initializeDb,
}
