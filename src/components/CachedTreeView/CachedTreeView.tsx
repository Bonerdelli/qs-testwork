import { useState, useEffect } from 'react'
import { Tree, Empty } from 'antd'
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
      setTreeData(treeNodes)
      setExpandedKeys(keys)
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
      expandedKeys={expandedKeys}
      selectedKeys={[activeId ?? 0]}
      defaultExpandedKeys={expandedKeys}
      // onClick={(key) => setExpandedKeys(key)}
      onExpand={antdTreeUseExpandedState(expandedKeys, setExpandedKeys)}
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
