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
const treeRouter = express.Router()

app.use(bodyParser.json())
app.use(cors(corsOptions))

treeRouter.param(['id'], (req, res, next, value) => {
  console.log('CALLED ONLY ONCE with', value)
  next()
})

treeRouter.get('/', getTree)
treeRouter.post('/bulk-update', bulkUpdateTreeNodes)

// NOTE: now we're using only bulk data update
// treeRouter.route('/:id', getTreeBranch)
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
