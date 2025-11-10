import {
  treeDataToNodes,
  cashedTreeItemsToNodes,
  getLeafNodeKeys,
} from '../tree'
import { TreeNode, TreeDataNode } from 'library/types'

describe('tree helpers', () => {
  describe('treeDataToNodes', () => {
    it('should convert simple tree node to TreeDataNode', () => {
      const treeNode: TreeNode = {
        id: 1,
        value: 'Root',
        parent: 0,
      }

      const result = treeDataToNodes(treeNode)

      expect(result.key).toBe(1)
      expect(result.title).toBe('Root')
      expect(result.treeNode).toEqual(treeNode)
      expect(result.isLeaf).toBe(true)
    })

    it('should convert tree node with children to TreeDataNode', () => {
      const treeNode: TreeNode = {
        id: 1,
        value: 'Root',
        parent: 0,
        childs: [
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
        ],
      }

      const result = treeDataToNodes(treeNode)

      expect(result.key).toBe(1)
      expect(result.title).toBe('Root')
      expect(result.treeNode).toEqual(treeNode)
      expect(result.children).toBeDefined()
      expect(result.children?.length).toBe(2)
      expect(result.children?.[0].key).toBe(2)
      expect(result.children?.[1].key).toBe(3)
    })

    it('should handle node with hasChilds flag', () => {
      const treeNode: TreeNode = {
        id: 1,
        value: 'Root',
        parent: 0,
        hasChilds: true,
      }

      const result = treeDataToNodes(treeNode)

      expect(result.key).toBe(1)
      expect(result.isLeaf).toBe(false)
      expect(result.children).toBeUndefined()
    })

    it('should convert nested tree structure', () => {
      const treeNode: TreeNode = {
        id: 1,
        value: 'Root',
        parent: 0,
        childs: [
          {
            id: 2,
            value: 'Child 1',
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

      const result = treeDataToNodes(treeNode)

      expect(result.children?.length).toBe(1)
      expect(result.children?.[0].children?.length).toBe(1)
      expect(result.children?.[0].children?.[0].key).toBe(3)
    })
  })

  describe('cashedTreeItemsToNodes', () => {
    it('should convert flat array of nodes to hierarchical structure', () => {
      const nodes: TreeNode[] = [
        {
          id: 1,
          value: 'Parent',
          parent: 0,
        },
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

      const result = cashedTreeItemsToNodes(nodes)

      expect(result.length).toBe(1)
      expect(result[0].key).toBe(1)
      expect(result[0].children?.length).toBe(2)
      expect(result[0].children?.[0].key).toBe(2)
      expect(result[0].children?.[1].key).toBe(3)
    })

    it('should handle multiple root nodes', () => {
      const nodes: TreeNode[] = [
        {
          id: 1,
          value: 'Root 1',
          parent: 0,
        },
        {
          id: 2,
          value: 'Root 2',
          parent: 0,
        },
      ]

      const result = cashedTreeItemsToNodes(nodes)

      expect(result.length).toBe(2)
      expect(result[0].key).toBe(1)
      expect(result[1].key).toBe(2)
    })

    it('should mark children as deleted when parent is deleted', () => {
      const nodes: TreeNode[] = [
        {
          id: 1,
          value: 'Parent',
          parent: 0,
          isDeleted: true,
        },
        {
          id: 2,
          value: 'Child',
          parent: 1,
        },
      ]

      const result = cashedTreeItemsToNodes(nodes)

      expect(result[0].children?.length).toBe(1)
      expect(result[0].children?.[0].treeNode?.is_parent_deleted).toBe(true)
    })

    it('should handle nodes with deleted_at flag', () => {
      const nodes: TreeNode[] = [
        {
          id: 1,
          value: 'Parent',
          parent: 0,
          deleted_at: new Date(),
        },
        {
          id: 2,
          value: 'Child',
          parent: 1,
        },
      ]

      const result = cashedTreeItemsToNodes(nodes)

      expect(result[0].children?.[0].treeNode?.is_parent_deleted).toBe(true)
    })

    it('should handle deep nested hierarchy', () => {
      const nodes: TreeNode[] = [
        {
          id: 1,
          value: 'Level 1',
          parent: 0,
        },
        {
          id: 2,
          value: 'Level 2',
          parent: 1,
        },
        {
          id: 3,
          value: 'Level 3',
          parent: 2,
        },
      ]

      const result = cashedTreeItemsToNodes(nodes)

      expect(result.length).toBe(1)
      expect(result[0].children?.length).toBe(1)
      expect(result[0].children?.[0].children?.length).toBe(1)
      expect(result[0].children?.[0].children?.[0].key).toBe(3)
    })

    it('should remove isLeaf property from nodes', () => {
      const nodes: TreeNode[] = [
        {
          id: 1,
          value: 'Node',
          parent: 0,
        },
      ]

      const result = cashedTreeItemsToNodes(nodes)

      expect(result[0].isLeaf).toBeUndefined()
    })
  })

  describe('getLeafNodeKeys', () => {
    it('should return empty array for empty tree', () => {
      const result = getLeafNodeKeys([])
      expect(result).toEqual([])
    })

    it('should return keys of nodes with children', () => {
      const treeData: TreeDataNode[] = [
        {
          key: 1,
          title: 'Parent',
          children: [
            {
              key: 2,
              title: 'Child',
            },
          ],
        },
      ]

      const result = getLeafNodeKeys(treeData)

      expect(result).toContain(1)
      expect(result.length).toBe(1)
    })

    it('should return all parent node keys in nested structure', () => {
      const treeData: TreeDataNode[] = [
        {
          key: 1,
          title: 'Level 1',
          children: [
            {
              key: 2,
              title: 'Level 2',
              children: [
                {
                  key: 3,
                  title: 'Level 3',
                },
              ],
            },
          ],
        },
      ]

      const result = getLeafNodeKeys(treeData)

      expect(result).toContain(1)
      expect(result).toContain(2)
      expect(result.length).toBe(2)
    })

    it('should not include leaf nodes', () => {
      const treeData: TreeDataNode[] = [
        {
          key: 1,
          title: 'Parent',
          children: [
            {
              key: 2,
              title: 'Leaf',
            },
          ],
        },
      ]

      const result = getLeafNodeKeys(treeData)

      expect(result).not.toContain(2)
      expect(result).toContain(1)
    })

    it('should handle multiple root nodes', () => {
      const treeData: TreeDataNode[] = [
        {
          key: 1,
          title: 'Root 1',
          children: [
            {
              key: 2,
              title: 'Child',
            },
          ],
        },
        {
          key: 3,
          title: 'Root 2',
          children: [
            {
              key: 4,
              title: 'Child',
            },
          ],
        },
      ]

      const result = getLeafNodeKeys(treeData)

      expect(result).toContain(1)
      expect(result).toContain(3)
      expect(result.length).toBe(2)
    })
  })
})

