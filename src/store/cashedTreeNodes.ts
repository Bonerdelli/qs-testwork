import { Action, Thunk, action, thunk } from 'easy-peasy'

import { TreeNode } from '../types'

import { saveTreeNodes } from '../api/tree'

export interface CashedTreeNodesStoreModel {
  nodes: TreeNode[]
  maxNodeId: number
  isChanged: boolean

  loadNode: Action<CashedTreeNodesStoreModel, TreeNode>
  unloadNode: Action<CashedTreeNodesStoreModel, TreeNode>

  removeNode: Action<CashedTreeNodesStoreModel, TreeNode>
  restoreNode: Action<CashedTreeNodesStoreModel, TreeNode>
  addChildNode: Action<CashedTreeNodesStoreModel, TreeNode>
  setNodeValue: Action<CashedTreeNodesStoreModel, [TreeNode, string]>

  saveChanges: Thunk<CashedTreeNodesStoreModel, TreeNode[]>
  setUnchanged: Action<CashedTreeNodesStoreModel>
  clear: Action<CashedTreeNodesStoreModel>
}

const getNodeIndex = (
  nodes: TreeNode[], id: number,
) => nodes.findIndex(item => item.id === id)

export const cashedTreeNodesStoreModel: CashedTreeNodesStoreModel = {
  nodes: [],
  maxNodeId: 0,
  isChanged: false,

  loadNode: action((state, payload) => {
    const { childs, ...node } = payload
    const index = getNodeIndex(state.nodes, node.id)
    if (index !== -1) {
      return
    }
    if (node.id > state.maxNodeId) {
      state.maxNodeId = node.id
    }
    delete node.hasChilds
    state.nodes = [
      ...state.nodes,
      node,
    ]
  }),

  unloadNode: action((state, payload) => {
    const { id } = payload
    const index = getNodeIndex(state.nodes, id)
    if (index !== -1) {
      state.nodes.splice(index, 1)
      state.nodes = [
        ...state.nodes,
      ]
    }
  }),

  removeNode: action((state, payload) => {
    const { id } = payload
    const index = getNodeIndex(state.nodes, id)
    if (index !== -1) {
      state.isChanged = true
      state.nodes[index] = {
        ...state.nodes[index],
        deletedAt: new Date(),
        isDeleted: true,
      }
    }
  }),

  restoreNode: action((state, payload) => {
    const { id } = payload
    const index = getNodeIndex(state.nodes, id)
    if (index !== -1) {
      state.isChanged = true
      state.nodes[index] = {
        ...state.nodes[index],
        deletedAt: undefined,
      }
    }
  }),

  addChildNode: action((state, payload) => {
    const { id } = payload
    const { maxNodeId } = state
    const index = getNodeIndex(state.nodes, id)
    if (index !== -1) {
      state.isChanged = true
      ++state.maxNodeId
      state.nodes.push({
        id: maxNodeId + 1,
        parent: id,
        value: '',
        isNew: true,
      })
    }
  }),

  setNodeValue: action((state, payload) => {
    const [{ id }, value] = payload
    const index = getNodeIndex(state.nodes, id)
    if (index !== -1) {
      state.isChanged = true
      state.nodes[index] = {
        ...state.nodes[index],
        updatedAt: new Date(),
        isUpdated: true,
        value,
      }
    }
  }),

  saveChanges: thunk(async (actions, payload) => {
    const { setUnchanged } = actions
    const result = await saveTreeNodes(payload)
    console.log('saveTreeNodes', result)
    setUnchanged()
  }),

  clear: action((state) => {
    state.nodes = []
  }),

  setUnchanged: action((state) => {
    state.isChanged = true // false
  }),
}
