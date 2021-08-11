import { TreeNode, TreeDataNode } from '../types'

export const TREE_ROOT_NODE_ID = 1

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
  }
  return dataNode
}

// TODO: rename to antd nodes?
export function treeDataToNodes(tree: TreeNode): TreeDataNode {
  return nodeMapper(tree)
}

export function cashedTreeItemsToNodes(treeNodes: TreeNode[]): TreeDataNode[] {
  const dataNodes = treeNodes.map(nodeMapper)
  return dataNodes
}
