import { Action, Thunk, action, thunk } from 'easy-peasy'

import { TreeNode } from '../types'

import { TreeBulkUpdateResponse, saveTreeNodes } from '../api/tree'
import { ApiErrorResponse } from '../helpers/api'

export interface CashedTreeNodesStoreModel {
  nodes: TreeNode[]
  isChanged: boolean

  maxNodeId: number
  confirmOverwriteIds?: TreeNode['id'][]
  savingError?: string

  loadNode: Action<CashedTreeNodesStoreModel, TreeNode>
  unloadNode: Action<CashedTreeNodesStoreModel, TreeNode>

  removeNode: Action<CashedTreeNodesStoreModel, TreeNode>
  restoreNode: Action<CashedTreeNodesStoreModel, TreeNode>
  addChildNode: Action<CashedTreeNodesStoreModel, TreeNode>
  setNodeValue: Action<CashedTreeNodesStoreModel, [TreeNode, string]>

  saveChanges: Thunk<CashedTreeNodesStoreModel, TreeNode[]>
  setUnchanged: Action<CashedTreeNodesStoreModel>
  setOverwriteConfirmation: Action<CashedTreeNodesStoreModel, TreeNode['id'][]>
  setSavingError: Action<CashedTreeNodesStoreModel, string>
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

  // TODO: move into dbTree
  // TODO: apiErrors state object
  saveChanges: thunk(async (actions, payload) => {
    const { setUnchanged, setSavingError, setOverwriteConfirmation } = actions
    const result = await saveTreeNodes(payload)
    if ((result as ApiErrorResponse)?.error) {
      const message = (result as ApiErrorResponse)?.error.message ?? 'Неизвестная ошибка'
      setSavingError(message)
      return
    }
    const typedResult = result as TreeBulkUpdateResponse
    if (typedResult.success) {
      setUnchanged()
      return
    }
    if (typedResult.overwriteConfirmRequired) {
      setOverwriteConfirmation(typedResult.overwriteConfirmRequired)
      return
    }
    setSavingError('Не удалось сохранить изменения')
  }),

  setOverwriteConfirmation: action((state, payload) => {
    state.confirmOverwriteIds = payload
  }),

  setSavingError: action((state, payload) => {
    state.savingError = payload
  }),

  clear: action((state) => {
    state.nodes = []
  }),

  setUnchanged: action((state) => {
    state.isChanged = false
  }),
}
