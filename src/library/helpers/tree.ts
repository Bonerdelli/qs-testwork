import { TreeNode, TreeDataNode } from 'library/types'

export const TREE_ROOT_NODE_ID = 1

interface TreeDataNodeExt extends TreeDataNode {
  exclude?: boolean
  parentIds?: TreeNode['id'][]
}

/**
 * Helper function to map tree item nodes to data nodes used in antd Tree
 */
const nodeMapper = (item: TreeNode): TreeDataNode => {
  const { value, id } = item
  const dataNode: TreeDataNode = {
    key: id,
    title: value,
    treeNode: item,
  }
  if (item.childs) {
    dataNode.children = item.childs.map(nodeMapper)
  } else if (item.hasChilds) {
    dataNode.isLeaf = false
  } else {
    dataNode.isLeaf = true
  }
  return dataNode
}

/**
 * Map tree data to antd tree nodes
 */
export function treeDataToNodes(tree: TreeNode): TreeDataNode {
  return nodeMapper(tree)
}

/**
 * Map locally cashed items to antd tree nodes
 */
export function cashedTreeItemsToNodes(treeNodes: TreeNode[]): TreeDataNode[] {
  const dataNodes = treeNodes.map(nodeMapper) as TreeDataNodeExt[]
  dataNodes.forEach(node => delete node.isLeaf) // Because we have partial hierarchy
  const hierarchyBuilder = (node: TreeDataNode) => {
    const childs = dataNodes
      .filter(n => n.treeNode?.parent === node.treeNode?.id)
    if (childs.length > 0) {
      node.children = childs
      childs.forEach((n) => {
        const parentId = node.treeNode?.id ?? 0
        n.parentIds = [parentId]
        n.exclude = true
      })
    }
  }
  dataNodes.forEach(hierarchyBuilder)
  const dataNodesHierarchy = dataNodes.filter(n => !n.exclude)
  return dataNodesHierarchy as TreeDataNode[]
}

/**
 * Exctract node keys for tree leafs
 */
export function getLeafNodeKeys(tree: TreeDataNode[]): number[] {
  const keys: number[] = []
  const treeIterator = (node: TreeDataNode) => {
    if (node.children) {
      node.children.forEach(treeIterator)
      keys.push(+node.key)
    }
  }
  tree.forEach(treeIterator)
  return keys
}
