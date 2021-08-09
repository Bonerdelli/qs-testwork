const express = require('express')
const { initDb, getLeaf, db } = require('./database')

const PORT = process.env.PORT || 3031
const app = express()

app.get('/tree/:nodeId', function(req, res) {
  const { nodeId } = req.params
  const leaf = getLeaf(nodeId)
  console.log(leaf)
});

app.listen(PORT, async () => {
  try {
    console.log(`Server listening on ${PORT}`)
    initDb()
  } catch (e) {
    console.error('Error', e.message)
  }
})
