/**
 * Cached tree nodes application state
 *
 * @author Nekrasov Andrew <bonerdelli@gmail.com>
 * @package qs-test-work
 */

import { Action, Thunk, action, thunk } from 'easy-peasy'
import { notification } from 'antd'

import { TreeNode } from 'library/types'
import { ApiErrorResponse } from 'library/helpers/api'
import { getNodes, getNode } from 'library/api/tree'

export interface CashedTreeNodesStoreModel {
  nodes: TreeNode[]
  nodeIds: TreeNode['id'][]
  lastNodeId: number
  isChanged: boolean
  isLoading: boolean
  apiError: string | null

  loadNode: Thunk<CashedTreeNodesStoreModel, TreeNode['id']>
  addNode: Action<CashedTreeNodesStoreModel, TreeNode>
  reloadNode: Action<CashedTreeNodesStoreModel, TreeNode>
  unloadNode: Action<CashedTreeNodesStoreModel, TreeNode>
  clearNodeStatuses: Action<CashedTreeNodesStoreModel>
  refreshNodesById: Thunk<CashedTreeNodesStoreModel, TreeNode['id'][]>
  setLoading: Action<CashedTreeNodesStoreModel, boolean>

  removeNode: Action<CashedTreeNodesStoreModel, TreeNode>
  restoreNode: Action<CashedTreeNodesStoreModel, TreeNode>
  addChildNode: Action<CashedTreeNodesStoreModel, TreeNode>
  setNodeValue: Action<CashedTreeNodesStoreModel, [TreeNode, string]>

  setApiError: Action<CashedTreeNodesStoreModel, string | null>
  setUnchanged: Action<CashedTreeNodesStoreModel>
  clear: Action<CashedTreeNodesStoreModel>
}

const getNodeIndex = (nodes: TreeNode[], id: number) => nodes.findIndex((item) => item.id === id)

export const cashedTreeNodesStoreModel: CashedTreeNodesStoreModel = {
  nodes: [],
  nodeIds: [],
  lastNodeId: 0,
  isLoading: false,
  isChanged: false,
  apiError: null,

  loadNode: thunk(async (actions, payload) => {
    const { addNode } = actions
    const node = await getNode(payload)
    if (!node) {
      notification.warning({
        message: 'Не удалось загрузить',
        description: 'Сервер вернул пустой результат',
        placement: 'bottomRight',
      })
      return
    }
    if (node.deleted_at || node.is_parent_deleted) {
      notification.warning({
        message: 'Не удалось загрузить',
        description: 'Выбранный узел был удалён из базы данных',
        placement: 'bottomRight',
      })
      return
    }
    addNode(node)
  }),

  addNode: action((state, payload) => {
    const { childs, ...node } = payload
    const { id } = node
    const index = getNodeIndex(state.nodes, id)
    if (index !== -1) {
      return
    }
    if (id > state.lastNodeId) {
      state.lastNodeId = id
    }
    delete node.hasChilds
    state.nodes.push(node)
    state.nodeIds.push(id)
  }),

  reloadNode: action((state, payload) => {
    const { childs, ...node } = payload
    const index = getNodeIndex(state.nodes, node.id)
    const { id } = node
    if (id > state.lastNodeId) {
      state.lastNodeId = id
    }
    delete node.hasChilds
    if (index === -1) {
      state.nodes.push(node)
      state.nodeIds.push(node.id)
    } else {
      state.nodes[index] = node
      state.nodeIds[index] = node.id
    }
  }),

  unloadNode: action((state, payload) => {
    const { id } = payload
    const index = getNodeIndex(state.nodes, id)
    if (index !== -1) {
      state.nodes.splice(index, 1)
      state.nodeIds.splice(index, 1)
      state.nodes = [...state.nodes]
    }
  }),

  clearNodeStatuses: action((state) => {
    const cleared = state.nodes.filter((node) => !node.isNew)
    cleared.forEach((node) => {
      delete node.isDeleted
      delete node.isUpdated
    })
    state.nodeIds = cleared.map((node) => node.id)
    state.nodes = cleared
    // NOTE: for the future...
    // const nodesMap: Record<TreeNode['id'], TreeNode> = {}
    // state.nodesMap = cleared.reduce((acc, node) => {
    //   acc[node.id] = node
    //   return acc
    // }, nodesMap)
  }),

  refreshNodesById: thunk(async (actions, payload) => {
    const { setApiError, reloadNode, setUnchanged, setLoading } = actions
    setLoading(true)
    setApiError(null)
    const result = await getNodes(payload)
    if (!result) {
      setApiError('Сервер вернул пустой результат')
      setLoading(false)
      return
    }
    if ((result as ApiErrorResponse).error) {
      setApiError((result as ApiErrorResponse).error.message)
      setLoading(false)
      return
    }
    if (Array.isArray(result)) {
      result.forEach((node) => reloadNode(node))
      setUnchanged()
      setTimeout(() => setLoading(false), 0) // Sorry
      return
    }
    setApiError('Сервер вернул пустой результат')
    setLoading(false)
  }),

  removeNode: action((state, payload) => {
    const { id } = payload
    const index = getNodeIndex(state.nodes, id)
    if (index !== -1) {
      state.isChanged = true
      state.nodes[index] = {
        ...state.nodes[index],
        deleted_at: new Date(),
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
        deleted_at: null,
        isUpdated: true,
        isDeleted: false,
      }
    }
  }),

  addChildNode: action((state, payload) => {
    const { id } = payload
    const { lastNodeId } = state
    const index = getNodeIndex(state.nodes, id)
    if (index !== -1) {
      state.isChanged = true
      ++state.lastNodeId
      state.nodeIds.push(lastNodeId + 1)
      state.nodes.push({
        id: lastNodeId + 1,
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
        isUpdated: true,
        value,
      }
    }
  }),

  setApiError: action((state, payload) => {
    state.apiError = payload
  }),

  setLoading: action((state, payload) => {
    state.isLoading = payload
  }),

  setUnchanged: action((state) => {
    state.isChanged = false
  }),

  clear: action((state) => {
    state.nodes = []
    state.nodeIds = []
  }),
}
