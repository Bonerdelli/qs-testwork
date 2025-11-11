import { createMockStore, createMockTreeNode } from '../testUtils'
import { TreeNode } from 'library/types'
import * as treeApi from 'library/api/tree'
import { notification } from 'antd'

jest.mock('library/api/tree')
jest.mock('antd', () => ({
  notification: {
    warning: jest.fn(),
  },
}))

const mockTreeApi = treeApi as jest.Mocked<typeof treeApi>

describe('cashedTreeNodes store', () => {
  let store: ReturnType<typeof createMockStore>

  beforeEach(() => {
    store = createMockStore()
    jest.clearAllMocks()
  })

  describe('actions', () => {
    describe('addNode', () => {
      it('should add new node to store', () => {
        const node = createMockTreeNode({ id: 1, value: 'Test Node' })

        store.getActions().cashedTreeNodes.addNode(node)

        const state = store.getState().cashedTreeNodes
        expect(state.nodes).toHaveLength(1)
        expect(state.nodes[0]).toMatchObject({
          id: 1,
          value: 'Test Node',
        })
        expect(state.nodeIds).toContain(1)
      })

      it('should not add duplicate node', () => {
        const node = createMockTreeNode({ id: 1 })

        store.getActions().cashedTreeNodes.addNode(node)
        store.getActions().cashedTreeNodes.addNode(node)

        const state = store.getState().cashedTreeNodes
        expect(state.nodes).toHaveLength(1)
        expect(state.nodeIds).toHaveLength(1)
      })

      it('should remove childs property when adding node', () => {
        const node = createMockTreeNode({
          id: 1,
          childs: [createMockTreeNode({ id: 2 })],
        })

        store.getActions().cashedTreeNodes.addNode(node)

        const state = store.getState().cashedTreeNodes
        expect(state.nodes[0].childs).toBeUndefined()
      })

      it('should update lastNodeId when adding node with higher id', () => {
        const node1 = createMockTreeNode({ id: 5 })
        const node2 = createMockTreeNode({ id: 10 })

        store.getActions().cashedTreeNodes.addNode(node1)
        store.getActions().cashedTreeNodes.addNode(node2)

        const state = store.getState().cashedTreeNodes
        expect(state.lastNodeId).toBe(10)
      })
    })

    describe('reloadNode', () => {
      it('should update existing node', () => {
        const node1 = createMockTreeNode({ id: 1, value: 'Old Value' })
        const node2 = createMockTreeNode({ id: 1, value: 'New Value' })

        store.getActions().cashedTreeNodes.addNode(node1)
        store.getActions().cashedTreeNodes.reloadNode(node2)

        const state = store.getState().cashedTreeNodes
        expect(state.nodes).toHaveLength(1)
        expect(state.nodes[0].value).toBe('New Value')
      })

      it('should add node if it does not exist', () => {
        const node = createMockTreeNode({ id: 1 })

        store.getActions().cashedTreeNodes.reloadNode(node)

        const state = store.getState().cashedTreeNodes
        expect(state.nodes).toHaveLength(1)
      })
    })

    describe('unloadNode', () => {
      it('should remove node from store', () => {
        const node = createMockTreeNode({ id: 1 })

        store.getActions().cashedTreeNodes.addNode(node)
        store.getActions().cashedTreeNodes.unloadNode(node)

        const state = store.getState().cashedTreeNodes
        expect(state.nodes).toHaveLength(0)
        expect(state.nodeIds).not.toContain(1)
      })

      it('should not fail when removing non-existent node', () => {
        const node = createMockTreeNode({ id: 999 })

        expect(() => {
          store.getActions().cashedTreeNodes.unloadNode(node)
        }).not.toThrow()
      })
    })

    describe('removeNode', () => {
      it('should mark node as deleted', () => {
        const node = createMockTreeNode({ id: 1 })

        store.getActions().cashedTreeNodes.addNode(node)
        store.getActions().cashedTreeNodes.removeNode(node)

        const state = store.getState().cashedTreeNodes
        expect(state.nodes[0].isDeleted).toBe(true)
        expect(state.nodes[0].deleted_at).toBeDefined()
        expect(state.isChanged).toBe(true)
      })

      it('should not fail when removing non-existent node', () => {
        const node = createMockTreeNode({ id: 999 })

        expect(() => {
          store.getActions().cashedTreeNodes.removeNode(node)
        }).not.toThrow()
      })
    })

    describe('restoreNode', () => {
      it('should restore deleted node', () => {
        const node = createMockTreeNode({ id: 1 })

        store.getActions().cashedTreeNodes.addNode(node)
        store.getActions().cashedTreeNodes.removeNode(node)
        store.getActions().cashedTreeNodes.restoreNode(node)

        const state = store.getState().cashedTreeNodes
        expect(state.nodes[0].isDeleted).toBe(false)
        expect(state.nodes[0].deleted_at).toBeNull()
        expect(state.nodes[0].isUpdated).toBe(true)
        expect(state.isChanged).toBe(true)
      })
    })

    describe('addChildNode', () => {
      it('should add new child node', () => {
        const parent = createMockTreeNode({ id: 1 })

        store.getActions().cashedTreeNodes.addNode(parent)
        store.getActions().cashedTreeNodes.addChildNode(parent)

        const state = store.getState().cashedTreeNodes
        expect(state.nodes).toHaveLength(2)
        expect(state.nodes[1].parent).toBe(1)
        expect(state.nodes[1].isNew).toBe(true)
        expect(state.nodes[1].value).toBe('')
        expect(state.isChanged).toBe(true)
        expect(state.lastNodeId).toBeGreaterThan(1)
      })

      it('should increment lastNodeId when adding child', () => {
        const parent = createMockTreeNode({ id: 1 })

        store.getActions().cashedTreeNodes.addNode(parent)
        const initialLastId = store.getState().cashedTreeNodes.lastNodeId
        store.getActions().cashedTreeNodes.addChildNode(parent)

        const state = store.getState().cashedTreeNodes
        expect(state.lastNodeId).toBe(initialLastId + 1)
      })

      it('should not add child if parent does not exist', () => {
        const parent = createMockTreeNode({ id: 999 })

        store.getActions().cashedTreeNodes.addChildNode(parent)

        const state = store.getState().cashedTreeNodes
        expect(state.nodes).toHaveLength(0)
      })
    })

    describe('setNodeValue', () => {
      it('should update node value', () => {
        const node = createMockTreeNode({ id: 1, value: 'Old Value' })

        store.getActions().cashedTreeNodes.addNode(node)
        store.getActions().cashedTreeNodes.setNodeValue([node, 'New Value'])

        const state = store.getState().cashedTreeNodes
        expect(state.nodes[0].value).toBe('New Value')
        expect(state.nodes[0].isUpdated).toBe(true)
        expect(state.isChanged).toBe(true)
      })

      it('should not fail when updating non-existent node', () => {
        const node = createMockTreeNode({ id: 999 })

        expect(() => {
          store.getActions().cashedTreeNodes.setNodeValue([node, 'Value'])
        }).not.toThrow()
      })
    })

    describe('clearNodeStatuses', () => {
      it('should clear status flags from nodes', () => {
        const node1 = createMockTreeNode({ id: 1, isUpdated: true })
        const node2 = createMockTreeNode({ id: 2, isNew: true })

        store.getActions().cashedTreeNodes.addNode(node1)
        store.getActions().cashedTreeNodes.addNode(node2)
        store.getActions().cashedTreeNodes.clearNodeStatuses()

        const state = store.getState().cashedTreeNodes
        expect(state.nodes).toHaveLength(1)
        expect(state.nodes[0].isUpdated).toBeUndefined()
        expect(state.nodes[0].isNew).toBeUndefined()
      })

      it('should remove new nodes', () => {
        const node = createMockTreeNode({ id: 1, isNew: true })

        store.getActions().cashedTreeNodes.addNode(node)
        store.getActions().cashedTreeNodes.clearNodeStatuses()

        const state = store.getState().cashedTreeNodes
        expect(state.nodes).toHaveLength(0)
      })
    })

    describe('setUnchanged', () => {
      it('should set isChanged to false', () => {
        const node = createMockTreeNode({ id: 1 })

        store.getActions().cashedTreeNodes.addNode(node)
        store.getActions().cashedTreeNodes.setNodeValue([node, 'New Value'])
        expect(store.getState().cashedTreeNodes.isChanged).toBe(true)

        store.getActions().cashedTreeNodes.setUnchanged()
        expect(store.getState().cashedTreeNodes.isChanged).toBe(false)
      })
    })

    describe('clear', () => {
      it('should clear all nodes', () => {
        const node1 = createMockTreeNode({ id: 1 })
        const node2 = createMockTreeNode({ id: 2 })

        store.getActions().cashedTreeNodes.addNode(node1)
        store.getActions().cashedTreeNodes.addNode(node2)
        store.getActions().cashedTreeNodes.clear()

        const state = store.getState().cashedTreeNodes
        expect(state.nodes).toHaveLength(0)
        expect(state.nodeIds).toHaveLength(0)
      })
    })

    describe('setLoading', () => {
      it('should set loading state', () => {
        store.getActions().cashedTreeNodes.setLoading(true)
        expect(store.getState().cashedTreeNodes.isLoading).toBe(true)

        store.getActions().cashedTreeNodes.setLoading(false)
        expect(store.getState().cashedTreeNodes.isLoading).toBe(false)
      })
    })

    describe('setApiError', () => {
      it('should set API error message', () => {
        store.getActions().cashedTreeNodes.setApiError('Test error')
        expect(store.getState().cashedTreeNodes.apiError).toBe('Test error')

        store.getActions().cashedTreeNodes.setApiError(null)
        expect(store.getState().cashedTreeNodes.apiError).toBeNull()
      })
    })
  })

  describe('thunks', () => {
    describe('loadNode', () => {
      it('should load and add node successfully', async () => {
        const node = createMockTreeNode({ id: 1 })
        mockTreeApi.getNode.mockResolvedValue(node)

        await store.getActions().cashedTreeNodes.loadNode(1)

        const state = store.getState().cashedTreeNodes
        expect(state.nodes).toHaveLength(1)
        expect(state.nodes[0].id).toBe(1)
        expect(mockTreeApi.getNode).toHaveBeenCalledWith(1)
      })

      it('should show warning when node is null', async () => {
        mockTreeApi.getNode.mockResolvedValue(null as any)

        await store.getActions().cashedTreeNodes.loadNode(1)

        expect(notification.warning).toHaveBeenCalled()
        const state = store.getState().cashedTreeNodes
        expect(state.nodes).toHaveLength(0)
      })

      it('should show warning when node is deleted', async () => {
        const node = createMockTreeNode({
          id: 1,
          deleted_at: new Date(),
        })
        mockTreeApi.getNode.mockResolvedValue(node)

        await store.getActions().cashedTreeNodes.loadNode(1)

        expect(notification.warning).toHaveBeenCalled()
        const state = store.getState().cashedTreeNodes
        expect(state.nodes).toHaveLength(0)
      })

      it('should show warning when node parent is deleted', async () => {
        const node = createMockTreeNode({
          id: 1,
          is_parent_deleted: true,
        })
        mockTreeApi.getNode.mockResolvedValue(node)

        await store.getActions().cashedTreeNodes.loadNode(1)

        expect(notification.warning).toHaveBeenCalled()
        const state = store.getState().cashedTreeNodes
        expect(state.nodes).toHaveLength(0)
      })
    })

    describe('refreshNodesById', () => {
      it('should refresh nodes successfully', async () => {
        const node1 = createMockTreeNode({ id: 1 })
        const node2 = createMockTreeNode({ id: 2 })
        mockTreeApi.getNodes.mockResolvedValue([node1, node2])

        await store.getActions().cashedTreeNodes.refreshNodesById([1, 2])

        // Wait for setTimeout to complete
        await new Promise((resolve) => setTimeout(resolve, 0))

        const state = store.getState().cashedTreeNodes
        expect(state.nodes).toHaveLength(2)
        expect(state.isChanged).toBe(false)
        expect(state.isLoading).toBe(false)
      })

      it('should handle API error', async () => {
        const errorResponse = {
          error: {
            message: 'Test error',
          },
        }
        mockTreeApi.getNodes.mockResolvedValue(errorResponse as any)

        await store.getActions().cashedTreeNodes.refreshNodesById([1])

        const state = store.getState().cashedTreeNodes
        expect(state.apiError).toBe('Test error')
        expect(state.isLoading).toBe(false)
      })

      it('should set loading state during refresh', async () => {
        const node = createMockTreeNode({ id: 1 })
        let resolvePromise: (value: TreeNode[]) => void
        const promise = new Promise<TreeNode[]>((resolve) => {
          resolvePromise = resolve
        })
        mockTreeApi.getNodes.mockReturnValue(promise as any)

        const refreshPromise = store.getActions().cashedTreeNodes.refreshNodesById([1])
        expect(store.getState().cashedTreeNodes.isLoading).toBe(true)

        resolvePromise!([node])
        await refreshPromise
        // Wait for setTimeout to complete
        await new Promise((resolve) => setTimeout(resolve, 0))

        expect(store.getState().cashedTreeNodes.isLoading).toBe(false)
      })
    })
  })
})
