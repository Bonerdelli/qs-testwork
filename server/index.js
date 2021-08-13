const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const { initDb } = require('./database')
const {
  getTree,
  getTreeBranch,
  addTreeNode,
  updateTreeNode,
  deleteTreeNode,
} = require('./api')

const PORT = process.env.PORT || 3001

const corsOptions = {
  origin: ['http://localhost:3000']
};

const app = express()
app.use(bodyParser)
app.use(cors(corsOptions))

const router = express.Router()
router.get('/tree', getTree)
router.get('/tree/:nodeId', getTreeBranch)
router.post('/tree', addTreeNode)
router.patch('/tree/:nodeId', updateTreeNode)
router.delete('/tree/:nodeId', deleteTreeNode)

app.listen(PORT, async () => {
  try {
    console.log(`Server listening on ${PORT}`)
    initDb()
  } catch (e) {
    console.error('Error', e.message)
  }
})
