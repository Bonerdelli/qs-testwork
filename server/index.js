const express = require('express')
const { initializeDb, database } = require('./database')

const PORT = process.env.PORT || 3001
const app = express()

app.listen(PORT, async () => {
  try {
    await initializeDb()
    console.log(`Server listening on ${PORT}`)
  } catch (e) {
    console.error('Error', e.message)
  }
})
