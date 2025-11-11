import { createMockStore, createMockTreeNode } from '../testUtils'
import { TreeNode } from 'library/types'
import * as treeApi from 'library/api/tree'
import { ApiErrorResponse, ApiSuccessResponse } from 'library/helpers/api'

jest.mock('library/api/tree')

const mockTreeApi = treeApi as jest.Mocked<typeof treeApi>

describe('dbTree store', () => {
  let store: ReturnType<typeof createMockStore>

  beforeEach(() => {
    store = createMockStore()
    jest.clearAllMocks()
  })

  describe('actions', () => {
    describe('setTree', () => {
      it('should set tree and build treeNodes map', () => {
        const tree: TreeNode = {
          id: 1,
          value: 'Root',
          parent: 0,
          childs: [
            {
              id: 2,
              value: 'Child',
              parent: 1,
            },
          ],
        }

        store.getActions().dbTree.setTree(tree)

        const state = store.getState().dbTree
        expect(state.tree).toEqual(tree)
        expect(state.treeNodes[1]).toBeDefined()
        expect(state.treeNodes[2]).toBeDefined()
        expect(state.treeNodes[1].value).toBe('Root')
        expect(state.treeNodes[2].value).toBe('Child')
      })

      it('should handle nested tree structure', () => {
        const tree: TreeNode = {
          id: 1,
          value: 'Root',
          parent: 0,
          childs: [
            {
              id: 2,
              value: 'Child',
              parent: 1,
              childs: [
                {
                  id: 3,
                  value: 'Grandchild',
                  parent: 2,
                },
              ],
            },
          ],
        }

        store.getActions().dbTree.setTree(tree)

        const state = store.getState().dbTree
        expect(state.treeNodes[1]).toBeDefined()
        expect(state.treeNodes[2]).toBeDefined()
        expect(state.treeNodes[3]).toBeDefined()
      })
    })

    describe('setBranchNodes', () => {
      it('should set branch nodes for existing node', () => {
        const tree: TreeNode = {
          id: 1,
          value: 'Root',
          parent: 0,
          hasChilds: true,
        }

        store.getActions().dbTree.setTree(tree)

        const branchNodes: TreeNode[] = [
          {
            id: 2,
            value: 'Child 1',
            parent: 1,
          },
          {
            id: 3,
            value: 'Child 2',
            parent: 1,
          },
        ]

        store.getActions().dbTree.setBranchNodes([1, branchNodes])

        const state = store.getState().dbTree
        // setBranchNodes updates treeNodes map by converting array to object
        expect(state.treeNodes[1].childs).toEqual(branchNodes)
        expect(state.treeNodes[1].hasChilds).toBeUndefined()
        expect(state.treeNodes[2]).toBeDefined()
        expect(state.treeNodes[3]).toBeDefined()
        expect(state.treeNodes[2].value).toBe('Child 1')
        expect(state.treeNodes[3].value).toBe('Child 2')
      })

      it('should not fail when tree is not set', () => {
        const branchNodes: TreeNode[] = [createMockTreeNode({ id: 2, parent: 1 })]

        expect(() => {
          store.getActions().dbTree.setBranchNodes([1, branchNodes])
        }).not.toThrow()
      })
    })

    describe('setExpandedKeys', () => {
      it('should set expanded keys', () => {
        const keys: number[] = [1, 2, 3]

        store.getActions().dbTree.setExpandedKeys(keys)

        const state = store.getState().dbTree
        expect(state.expandedKeys).toEqual(keys)
      })
    })

    describe('setLoading', () => {
      it('should set loading state', () => {
        store.getActions().dbTree.setLoading(true)
        expect(store.getState().dbTree.isLoading).toBe(true)

        store.getActions().dbTree.setLoading(false)
        expect(store.getState().dbTree.isLoading).toBe(false)
      })
    })

    describe('setSavedSuccessfully', () => {
      it('should set saved successfully flag', () => {
        store.getActions().dbTree.setSavedSuccessfully(true)
        expect(store.getState().dbTree.savedSuccessfully).toBe(true)

        store.getActions().dbTree.setSavedSuccessfully(false)
        expect(store.getState().dbTree.savedSuccessfully).toBe(false)
      })
    })

    describe('setAddedNodeIds', () => {
      it('should set added node ids', () => {
        const ids: number[] = [1, 2, 3]

        store.getActions().dbTree.setAddedNodeIds(ids)

        const state = store.getState().dbTree
        expect(state.addedNodeIds).toEqual(ids)
      })
    })

    describe('setOverwriteConfirmation', () => {
      it('should set overwrite confirmation ids', () => {
        const ids: number[] = [1, 2]

        store.getActions().dbTree.setOverwriteConfirmation(ids)

        const state = store.getState().dbTree
        expect(state.confirmOverwriteIds).toEqual(ids)
      })
    })

    describe('setApiError', () => {
      it('should set API error for specific type', () => {
        store.getActions().dbTree.setApiError(['loadData', 'Test error'])
        expect(store.getState().dbTree.apiErrors.loadData).toBe('Test error')

        store.getActions().dbTree.setApiError(['saveChanges', 'Save error'])
        expect(store.getState().dbTree.apiErrors.saveChanges).toBe('Save error')

        store.getActions().dbTree.setApiError(['resetTree', 'Reset error'])
        expect(store.getState().dbTree.apiErrors.resetTree).toBe('Reset error')
      })

      it('should clear error when null is passed', () => {
        store.getActions().dbTree.setApiError(['loadData', 'Test error'])
        store.getActions().dbTree.setApiError(['loadData', null])
        expect(store.getState().dbTree.apiErrors.loadData).toBeNull()
      })
    })

    describe('clearApiErrors', () => {
      it('should clear all API errors', () => {
        store.getActions().dbTree.setApiError(['loadData', 'Error 1'])
        store.getActions().dbTree.setApiError(['saveChanges', 'Error 2'])
        store.getActions().dbTree.setApiError(['resetTree', 'Error 3'])

        store.getActions().dbTree.clearApiErrors()

        const state = store.getState().dbTree
        expect(state.apiErrors.loadData).toBeNull()
        expect(state.apiErrors.saveChanges).toBeNull()
        expect(state.apiErrors.resetTree).toBeNull()
      })
    })

    describe('clear', () => {
      it('should clear tree and expanded keys', () => {
        const tree = createMockTreeNode({ id: 1 })

        store.getActions().dbTree.setTree(tree)
        store.getActions().dbTree.setExpandedKeys([1, 2, 3])
        store.getActions().dbTree.clear()

        const state = store.getState().dbTree
        expect(state.tree).toBeUndefined()
        expect(state.expandedKeys).toEqual([])
      })
    })
  })

  describe('thunks', () => {
    describe('reloadTree', () => {
      it('should reload tree successfully', async () => {
        const tree = createMockTreeNode({ id: 1 })
        mockTreeApi.getTree.mockResolvedValue(tree as any)

        const result = await store.getActions().dbTree.reloadTree()

        const state = store.getState().dbTree
        expect(result).toBe(true)
        expect(state.tree).toEqual(tree)
        expect(state.isLoading).toBe(false)
        expect(state.apiErrors.loadData).toBeNull()
      })

      it('should handle API error', async () => {
        const errorResponse: ApiErrorResponse = {
          error: {
            message: 'Test error',
          },
        }
        mockTreeApi.getTree.mockResolvedValue(errorResponse as any)

        const result = await store.getActions().dbTree.reloadTree()

        const state = store.getState().dbTree
        expect(result).toBe(false)
        expect(state.apiErrors.loadData).toBe('Test error')
        expect(state.isLoading).toBe(false)
      })

      it('should handle empty result', async () => {
        mockTreeApi.getTree.mockResolvedValue(null as any)

        const result = await store.getActions().dbTree.reloadTree()

        const state = store.getState().dbTree
        expect(result).toBe(false)
        expect(state.apiErrors.loadData).toBe('Сервер вернул пустой результат')
        expect(state.isLoading).toBe(false)
      })

      it('should clear tree before loading', async () => {
        const existingTree = createMockTreeNode({ id: 1 })
        store.getActions().dbTree.setTree(existingTree)

        const newTree = createMockTreeNode({ id: 2 })
        mockTreeApi.getTree.mockResolvedValue(newTree as any)

        await store.getActions().dbTree.reloadTree()

        const state = store.getState().dbTree
        expect(state.tree).toEqual(newTree)
      })

      it('should set loading state during reload', async () => {
        const tree = createMockTreeNode({ id: 1 })
        let resolvePromise: (value: TreeNode) => void
        const promise = new Promise<TreeNode>((resolve) => {
          resolvePromise = resolve
        })
        mockTreeApi.getTree.mockReturnValue(promise as any)

        const reloadPromise = store.getActions().dbTree.reloadTree()
        expect(store.getState().dbTree.isLoading).toBe(true)

        resolvePromise!(tree)
        await reloadPromise

        expect(store.getState().dbTree.isLoading).toBe(false)
      })
    })

    describe('resetTreeData', () => {
      it('should reset tree data successfully', async () => {
        const successResponse: ApiSuccessResponse = {
          success: true,
        }
        const tree = createMockTreeNode({ id: 1 })
        mockTreeApi.resetTreeData.mockResolvedValue(successResponse as any)
        mockTreeApi.getTree.mockResolvedValue(tree as any)

        const result = await store.getActions().dbTree.resetTreeData()

        const state = store.getState().dbTree
        expect(result).toBe(true)
        expect(state.tree).toEqual(tree)
        expect(state.isLoading).toBe(false)
        expect(state.apiErrors.resetTree).toBeNull()
      })

      it('should handle API error', async () => {
        const errorResponse: ApiErrorResponse = {
          error: {
            message: 'Reset error',
          },
        }
        mockTreeApi.resetTreeData.mockResolvedValue(errorResponse as any)

        const result = await store.getActions().dbTree.resetTreeData()

        const state = store.getState().dbTree
        expect(result).toBe(false)
        expect(state.apiErrors.resetTree).toBe('Reset error')
        expect(state.isLoading).toBe(false)
      })

      it('should handle empty result', async () => {
        mockTreeApi.resetTreeData.mockResolvedValue(null as any)

        const result = await store.getActions().dbTree.resetTreeData()

        const state = store.getState().dbTree
        expect(result).toBe(false)
        expect(state.apiErrors.resetTree).toBe('Сервер вернул пустой результат')
        expect(state.isLoading).toBe(false)
      })
    })

    describe('loadBranch', () => {
      it('should load branch successfully', async () => {
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
        mockTreeApi.getBranch.mockResolvedValue(branch)

        await store.getActions().dbTree.loadBranch(createMockTreeNode({ id: 1 }))

        const state = store.getState().dbTree
        expect(state.isLoading).toBe(false)
        expect(mockTreeApi.getBranch).toHaveBeenCalledWith(1)
      })

      it('should set loading state during load', async () => {
        const branch: TreeNode = {
          id: 1,
          value: 'Parent',
          parent: 0,
          childs: [],
        }
        let resolvePromise: (value: TreeNode) => void
        const promise = new Promise<TreeNode>((resolve) => {
          resolvePromise = resolve
        })
        mockTreeApi.getBranch.mockReturnValue(promise)

        const loadPromise = store.getActions().dbTree.loadBranch(createMockTreeNode({ id: 1 }))
        expect(store.getState().dbTree.isLoading).toBe(true)

        resolvePromise!(branch)
        await loadPromise

        expect(store.getState().dbTree.isLoading).toBe(false)
      })

      it('should not set branch nodes if branch has no children', async () => {
        const branch: TreeNode = {
          id: 1,
          value: 'Parent',
          parent: 0,
        }
        mockTreeApi.getBranch.mockResolvedValue(branch)

        await store.getActions().dbTree.loadBranch(createMockTreeNode({ id: 1 }))

        expect(mockTreeApi.getBranch).toHaveBeenCalledWith(1)
      })
    })

    describe('saveChanges', () => {
      it('should save changes successfully', async () => {
        const nodes: TreeNode[] = [createMockTreeNode({ id: 1, isUpdated: true })]
        const response = {
          success: true,
          addedNodeIds: [2, 3],
        }
        mockTreeApi.saveTreeNodes.mockResolvedValue(response as any)

        await store.getActions().dbTree.saveChanges([nodes])

        const state = store.getState().dbTree
        expect(state.savedSuccessfully).toBe(true)
        expect(state.addedNodeIds).toEqual([2, 3])
        expect(state.confirmOverwriteIds).toEqual([])
        expect(state.apiErrors.saveChanges).toBeNull()
      })

      it('should handle overwrite confirmation required', async () => {
        const nodes: TreeNode[] = [createMockTreeNode({ id: 1, isUpdated: true })]
        const response = {
          success: false,
          overwriteConfirmRequired: [1, 2],
        }
        mockTreeApi.saveTreeNodes.mockResolvedValue(response as any)

        await store.getActions().dbTree.saveChanges([nodes])

        const state = store.getState().dbTree
        expect(state.confirmOverwriteIds).toEqual([1, 2])
        expect(state.savedSuccessfully).toBe(false)
      })

      it('should handle API error', async () => {
        const nodes: TreeNode[] = [createMockTreeNode({ id: 1, isUpdated: true })]
        const response = {
          success: false,
        }
        mockTreeApi.saveTreeNodes.mockResolvedValue(response as any)

        await store.getActions().dbTree.saveChanges([nodes])

        const state = store.getState().dbTree
        expect(state.apiErrors.saveChanges).toBe('Не удалось сохранить изменения')
        expect(state.savedSuccessfully).toBe(false)
      })

      it('should pass confirmForOverwriteIds to API', async () => {
        const nodes: TreeNode[] = [createMockTreeNode({ id: 1, isUpdated: true })]
        const confirmIds = [1, 2]
        const response = {
          success: true,
        }
        mockTreeApi.saveTreeNodes.mockResolvedValue(response as any)

        await store.getActions().dbTree.saveChanges([nodes, confirmIds])

        expect(mockTreeApi.saveTreeNodes).toHaveBeenCalledWith(nodes, confirmIds, expect.any(Function))
      })
    })
  })
})
