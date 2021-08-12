import { useState, useEffect } from 'react'
import { Tree, Empty } from 'antd'
import { DataNode } from 'antd/es/tree'

import { CachedTreeNode } from './CachedTreeNode'
import { CachedTreeNodeDeleted } from './CachedTreeNodeDeleted'
import { CachedTreeNodeEditor } from './CachedTreeNodeEditor'
import { cashedTreeItemsToNodes } from '../../helpers/tree'
import { useStoreState } from '../../store'
import { TreeDataNode } from '../../types'

export const CachedTreeView: React.FC = () => {
  const { nodes } = useStoreState(state => state.cashedTreeNodes)
  const { activeId } = useStoreState(state => state.nodeEdit)

  const [treeData, setTreeData] = useState<DataNode[]>()
  const [expandedKeys, setExpandedKeys] = useState<string[]>()

  useEffect(() => {
    if (nodes) {
      const treeNodes = cashedTreeItemsToNodes(nodes)
      if (!expandedKeys) {
        const keys = nodes.map(node => node.id.toString())
        setExpandedKeys(keys)
      }
      setTreeData(treeNodes)
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

  return treeData?.length ? (
    <Tree
      treeData={treeData}
      draggable={false}
      defaultExpandAll
      selectedKeys={[activeId ?? 0]}
      defaultExpandedKeys={expandedKeys}
      titleRender={(node: TreeDataNode) => renderNode(node)}
      className="cashed-tree"
    />
  ) : (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={(<>Загрузите элементы,<br /> чтобы начать редактирование</>)}
    />
  )
}
