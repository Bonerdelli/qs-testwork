const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const { initDb } = require('./database')
const {
  getTree,
  getTreeBranch,
  bulkUpdateTreeNodes,
  addTreeNode,
  updateTreeNode,
  deleteTreeNode,
} = require('./api')

const PORT = process.env.PORT || 3001

const corsOptions = {
  origin: ['http://localhost:3000']
};

const app = express()
app.use(bodyParser.json())
app.use(cors(corsOptions))

app.get('/tree', getTree)
app.post('/tree/bulk-update', bulkUpdateTreeNodes)
app.route('/tree/:nodeId')
  .get(getTreeBranch)
  // NOTE: now we're using only bulk data update
  .post(addTreeNode)
  .patch(updateTreeNode)
  .delete(deleteTreeNode)

app.listen(PORT, async () => {
  try {
    console.log(`Server listening on ${PORT}`)
    initDb()
  } catch (e) {
    console.error('Error', e.message)
  }
})
