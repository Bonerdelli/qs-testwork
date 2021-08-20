import { useState, useEffect } from 'react'
import { Tree } from 'antd'
import { DataNode } from 'antd/es/tree'

import { useStoreState } from 'library/store'
import { TreeDataNode } from 'library/types'
import { cashedTreeItemsToNodes } from 'library/helpers/tree'
import { antdTreeUseExpandedState } from 'library/helpers/antd'
import { CachedTreeNodeDeleted } from './CachedTreeNodeDeleted'
import { CachedTreeNodeEditor } from './CachedTreeNodeEditor'
import { CachedTreeNode } from './CachedTreeNode'

export const CachedTreeView: React.FC = () => {
  const { nodes } = useStoreState(state => state.cashedTreeNodes)
  const { activeId } = useStoreState(state => state.nodeEdit)

  const [treeData, setTreeData] = useState<DataNode[]>()
  const [expandedKeys, setExpandedKeys] = useState<number[]>([])

  useEffect(() => {
    if (nodes) {
      const treeNodes = cashedTreeItemsToNodes(nodes)
      const keys = nodes.map(node => node.id)
      if (treeNodes.length > 1 && !activeId) {
        // Workaround that prevents animation flickering
        setTimeout(() => setTreeData(treeNodes))
      } else {
        setTreeData(treeNodes)
      }
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
