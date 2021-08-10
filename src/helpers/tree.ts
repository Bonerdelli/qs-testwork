import { DataNode } from 'antd/es/tree'
import { TreeNode } from '../types'

export function treeDataToNodes(tree: TreeNode): DataNode {
  const nodeMapper = (item: TreeNode): DataNode => {
    const { value, id } = item
    const dataNode: DataNode = {
      key: id,
      title: value,
    }
    if (item.childs) {
      dataNode.children = item.childs.map(nodeMapper)
    }
    return dataNode
  }
  return nodeMapper(tree)
}
