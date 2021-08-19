import { useState, useEffect } from 'react'
import { Tree } from 'antd'
import { DataNode } from 'antd/es/tree'

import { CachedTreeNode } from './CachedTreeNode'
import { CachedTreeNodeDeleted } from './CachedTreeNodeDeleted'
import { CachedTreeNodeEditor } from './CachedTreeNodeEditor'
import { cashedTreeItemsToNodes } from '../../helpers/tree'
import { antdTreeUseExpandedState } from '../../helpers/antd'
import { useStoreState } from '../../store'
import { TreeDataNode } from '../../types'

export const CachedTreeView: React.FC = () => {
  const { nodes } = useStoreState(state => state.cashedTreeNodes)
  const { activeId } = useStoreState(state => state.nodeEdit)

  const [treeData, setTreeData] = useState<DataNode[]>()
  const [expandedKeys, setExpandedKeys] = useState<number[]>([])

  useEffect(() => {
    if (nodes) {
      const treeNodes = cashedTreeItemsToNodes(nodes)
      const keys = nodes.map(node => node.id)
      setTimeout(() => setTreeData(treeNodes)) // Prevents animation flickering
      setExpandedKeys(keys)
    } else {
      setTreeData([])
      setExpandedKeys([])
    }
  }, [nodes])

  const renderNode = (node: TreeDataNode) => {
    if (node.treeNode?.deletedAt) {
      return <CachedTreeNodeDeleted dataNode={node} />
    }
    if (node.treeNode?.id === activeId) {
      return <CachedTreeNodeEditor dataNode={node} />
    }
    return <CachedTreeNode dataNode={node} />
  }

  return (
    <Tree
      treeData={treeData}
      draggable={false}
      defaultExpandAll
      expandedKeys={expandedKeys}
      selectedKeys={[activeId ?? 0]}
      defaultExpandedKeys={expandedKeys}
      onExpand={antdTreeUseExpandedState(expandedKeys, setExpandedKeys)}
      titleRender={(node: TreeDataNode) => renderNode(node)}
      className="cashed-tree"
    />
  )
}
