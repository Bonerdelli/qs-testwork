const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const { initDb } = require('./database')
const {
  getTree,
  getTreeNode,
  getTreeBranch,
  getTreeNodes,
  bulkUpdateTreeNodes,
  addTreeNode,
  updateTreeNode,
  deleteTreeNode,
  resetTreeData,
} = require('./tree-api')

const PORT = process.env.PORT || 3001

const corsOptions = {
  origin: ['http://localhost:3000']
};

const app = express()
const treeRouter = express.Router()

app.use(bodyParser.json())
app.use(cors(corsOptions))

treeRouter.param(['id'], (req, res, next, value) => {
  next()
})

treeRouter.get('/', getTree)
treeRouter.get('/branch/:id', getTreeBranch)
treeRouter.get('/node/:id', getTreeNode)

treeRouter.post('/bulk-update', bulkUpdateTreeNodes)
treeRouter.get('/reset-data', resetTreeData)
treeRouter.post('/nodes', getTreeNodes)

// NOTE: only bulk editing implemented
// treeRouter.route('/:id')
//   .post(addTreeNode)
//   .patch(updateTreeNode)
//   .delete(deleteTreeNode)

app.use('/tree', treeRouter)

app.listen(PORT, async () => {
  try {
    console.log(`Server listening on ${PORT}`)
    initDb()
  } catch (e) {
    console.error('Error', e.message)
  }
})
