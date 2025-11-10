import * as treeApi from '../tree'
import * as apiHelpers from 'library/helpers/api'
import { TreeNode } from 'library/types'
import { ApiErrorResponse, ApiSuccessResponse } from 'library/helpers/api'

jest.mock('library/helpers/api')

const mockApiHelpers = apiHelpers as jest.Mocked<typeof apiHelpers>

describe('tree API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getTree', () => {
    it('should get tree successfully', async () => {
      const tree: TreeNode = {
        id: 1,
        value: 'Root',
        parent: 0,
      }
      mockApiHelpers.getJson.mockResolvedValue(tree)

      const result = await treeApi.getTree()

      expect(mockApiHelpers.getJson).toHaveBeenCalledWith('/tree')
      expect(result).toEqual(tree)
    })

    it('should return error response on failure', async () => {
      const errorResponse: ApiErrorResponse = {
        error: {
          message: 'Test error',
        },
      }
      mockApiHelpers.getJson.mockResolvedValue(errorResponse)

      const result = await treeApi.getTree()

      expect(result).toEqual(errorResponse)
    })
  })

  describe('getBranch', () => {
    it('should get branch successfully', async () => {
      const branch: TreeNode = {
        id: 1,
        value: 'Parent',
        parent: 0,
        childs: [
          {
            id: 2,
            value: 'Child',
            parent: 1,
          },
        ],
      }
      mockApiHelpers.getJson.mockResolvedValue(branch)

      const result = await treeApi.getBranch(1)

      expect(mockApiHelpers.getJson).toHaveBeenCalledWith('/tree/branch/1')
      expect(result).toEqual(branch)
    })
  })

  describe('getNode', () => {
    it('should get node successfully', async () => {
      const node: TreeNode = {
        id: 1,
        value: 'Node',
        parent: 0,
      }
      mockApiHelpers.getJson.mockResolvedValue(node)

      const result = await treeApi.getNode(1)

      expect(mockApiHelpers.getJson).toHaveBeenCalledWith('/tree/node/1')
      expect(result).toEqual(node)
    })
  })

  describe('getNodes', () => {
    it('should get nodes by ids successfully', async () => {
      const nodes: TreeNode[] = [
        {
          id: 1,
          value: 'Node 1',
          parent: 0,
        },
        {
          id: 2,
          value: 'Node 2',
          parent: 0,
        },
      ]
      mockApiHelpers.post.mockResolvedValue(nodes)

      const result = await treeApi.getNodes([1, 2])

      expect(mockApiHelpers.post).toHaveBeenCalledWith('/tree/nodes', { ids: [1, 2] })
      expect(result).toEqual(nodes)
    })

    it('should return error response on failure', async () => {
      const errorResponse: ApiErrorResponse = {
        error: {
          message: 'Test error',
        },
      }
      mockApiHelpers.post.mockResolvedValue(errorResponse)

      const result = await treeApi.getNodes([1, 2])

      expect(result).toEqual(errorResponse)
    })
  })

  describe('saveTreeNodes', () => {
    it('should save tree nodes successfully', async () => {
      const nodes: TreeNode[] = [
        {
          id: 1,
          value: 'Node 1',
          parent: 0,
          isUpdated: true,
        },
        {
          id: 2,
          value: 'Node 2',
          parent: 0,
          isDeleted: true,
        },
        {
          id: 3,
          value: 'Node 3',
          parent: 0,
          isNew: true,
        },
      ]
      const response = {
        success: true,
        addedNodeIds: [3],
      }
      mockApiHelpers.post.mockResolvedValue(response)

      const result = await treeApi.saveTreeNodes(nodes)

      const callArgs = mockApiHelpers.post.mock.calls[0]
      expect(callArgs[0]).toBe('/tree/bulk-update')
      expect(callArgs[1].updatedNodes).toHaveLength(1)
      expect(callArgs[1].deletedNodes).toHaveLength(1)
      expect(callArgs[1].addedNodes).toHaveLength(1)
      expect(callArgs[1].addedNodes[0].id).toBe(3)
      expect(result).toEqual(response)
    })

    it('should filter nodes correctly', async () => {
      const nodes: TreeNode[] = [
        {
          id: 1,
          value: 'Node 1',
          parent: 0,
          isUpdated: true,
        },
        {
          id: 2,
          value: '',
          parent: 0,
          isUpdated: true,
        },
        {
          id: 3,
          value: 'Node 3',
          parent: 0,
        },
      ]
      const response = {
        success: true,
      }
      mockApiHelpers.post.mockResolvedValue(response)

      await treeApi.saveTreeNodes(nodes)

      expect(mockApiHelpers.post).toHaveBeenCalledWith(
        '/tree/bulk-update',
        expect.objectContaining({
          updatedNodes: [nodes[0]],
          deletedNodes: [],
          addedNodes: [],
        }),
        undefined,
      )
    })

    it('should pass confirmForOverwriteIds', async () => {
      const nodes: TreeNode[] = [
        {
          id: 1,
          value: 'Node 1',
          parent: 0,
          isUpdated: true,
        },
      ]
      const confirmIds = [1, 2]
      const response = {
        success: true,
      }
      mockApiHelpers.post.mockResolvedValue(response)

      await treeApi.saveTreeNodes(nodes, confirmIds)

      expect(mockApiHelpers.post).toHaveBeenCalledWith(
        '/tree/bulk-update',
        expect.objectContaining({
          confirmForOverwriteIds: confirmIds,
          updatedNodes: nodes,
          deletedNodes: [],
          addedNodes: [],
        }),
        undefined,
      )
    })

    it('should pass error handler', async () => {
      const nodes: TreeNode[] = [
        {
          id: 1,
          value: 'Node 1',
          parent: 0,
          isUpdated: true,
        },
      ]
      const errorHandler = jest.fn()
      const response = {
        success: true,
      }
      mockApiHelpers.post.mockResolvedValue(response)

      await treeApi.saveTreeNodes(nodes, undefined, errorHandler)

      expect(mockApiHelpers.post).toHaveBeenCalledWith(
        '/tree/bulk-update',
        expect.any(Object),
        errorHandler,
      )
    })
  })

  describe('resetTreeData', () => {
    it('should reset tree data successfully', async () => {
      const response: ApiSuccessResponse = {
        success: true,
      }
      mockApiHelpers.getJson.mockResolvedValue(response)

      const result = await treeApi.resetTreeData()

      expect(mockApiHelpers.getJson).toHaveBeenCalledWith('/tree/reset-data')
      expect(result).toEqual(response)
    })

    it('should return error response on failure', async () => {
      const errorResponse: ApiErrorResponse = {
        error: {
          message: 'Test error',
        },
      }
      mockApiHelpers.getJson.mockResolvedValue(errorResponse)

      const result = await treeApi.resetTreeData()

      expect(result).toEqual(errorResponse)
    })
  })

  describe('addTreeNode', () => {
    it('should add tree node successfully', async () => {
      const node = {
        value: 'New Node',
        parent: 0,
      }
      const response: ApiSuccessResponse = {
        success: true,
      }
      mockApiHelpers.post.mockResolvedValue(response)
      mockApiHelpers.isSuccessful.mockReturnValue(true)

      const result = await treeApi.addTreeNode(node)

      expect(mockApiHelpers.post).toHaveBeenCalledWith('/tree', node)
      expect(result).toBe(true)
    })

    it('should return false on failure', async () => {
      const node = {
        value: 'New Node',
        parent: 0,
      }
      const errorResponse: ApiErrorResponse = {
        error: {
          message: 'Test error',
        },
      }
      mockApiHelpers.post.mockResolvedValue(errorResponse)
      mockApiHelpers.isSuccessful.mockReturnValue(false)

      const result = await treeApi.addTreeNode(node)

      expect(result).toBe(false)
    })
  })

  describe('updateTreeNode', () => {
    it('should update tree node successfully', async () => {
      const node = {
        value: 'Updated Node',
        parent: 0,
      }
      const response: ApiSuccessResponse = {
        success: true,
      }
      mockApiHelpers.put.mockResolvedValue(response)
      mockApiHelpers.isSuccessful.mockReturnValue(true)

      const result = await treeApi.updateTreeNode(1, node)

      expect(mockApiHelpers.put).toHaveBeenCalledWith('/tree/1', node)
      expect(result).toBe(true)
    })

    it('should return false on failure', async () => {
      const node = {
        value: 'Updated Node',
        parent: 0,
      }
      const errorResponse: ApiErrorResponse = {
        error: {
          message: 'Test error',
        },
      }
      mockApiHelpers.put.mockResolvedValue(errorResponse)
      mockApiHelpers.isSuccessful.mockReturnValue(false)

      const result = await treeApi.updateTreeNode(1, node)

      expect(result).toBe(false)
    })
  })

  describe('deleteTreeNode', () => {
    it('should delete tree node successfully', async () => {
      const response: ApiSuccessResponse = {
        success: true,
      }
      mockApiHelpers.del.mockResolvedValue(response)
      mockApiHelpers.isSuccessful.mockReturnValue(true)

      const result = await treeApi.deleteTreeNode(1)

      expect(mockApiHelpers.del).toHaveBeenCalledWith('/tree/1')
      expect(result).toBe(true)
    })

    it('should return false on failure', async () => {
      const errorResponse: ApiErrorResponse = {
        error: {
          message: 'Test error',
        },
      }
      mockApiHelpers.del.mockResolvedValue(errorResponse)
      mockApiHelpers.isSuccessful.mockReturnValue(false)

      const result = await treeApi.deleteTreeNode(1)

      expect(result).toBe(false)
    })
  })
})

