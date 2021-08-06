const express = require('express')
const { initDb, db } = require('./database')

const PORT = process.env.PORT || 3001
const app = express()

app.listen(PORT, async () => {
  try {
    console.log(`Server listening on ${PORT}`)
    initDb()
    const row = db.prepare('SELECT * FROM tree WHERE id = ?').get(1)
    console.log('Test db', row)
  } catch (e) {
    console.error('Error', e.message)
  }
})
