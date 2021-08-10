import { DataNode } from 'antd/es/tree'
import { DataItem } from '../types'

export function treeDataToNodes(tree: DataItem): DataNode {
  const nodeMapper = (item: DataItem): DataNode => {
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
