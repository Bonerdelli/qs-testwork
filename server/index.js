const express = require('express')
const cors = require('cors')

const {
  TREE_ROOT_NODE_ID,
  db,
  initDb,
  getLeaf,
  getSubtree,
} = require('./database')

const PORT = process.env.PORT || 3001

const corsOptions = {
  origin: ['http://localhost:3000']
};

const app = express()
app.use(cors(corsOptions))

const sendJson = (res, data) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(data));
}

app.get('/tree', function(req, res) {
  const subtree = getSubtree(1, 2) // TODO: put it to constants
  sendJson(res, subtree)
});

app.get('/tree/:nodeId', function(req, res) {
  const { nodeId } = req.params
  const leaf = getLeaf(nodeId)
  sendJson(res, leaf)
});

app.listen(PORT, async () => {
  try {
    console.log(`Server listening on ${PORT}`)
    initDb()
  } catch (e) {
    console.error('Error', e.message)
  }
})
