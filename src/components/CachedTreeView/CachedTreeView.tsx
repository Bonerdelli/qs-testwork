import { useState, useEffect } from 'react'
import { Tree, Empty } from 'antd'
import { DataNode } from 'antd/es/tree'

import { CachedTreeNode } from './CachedTreeNode'
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
  return treeData?.length ? (
    <Tree
      treeData={treeData}
      draggable={false}
      defaultExpandAll
      selectedKeys={[activeId ?? 0]}
      defaultExpandedKeys={expandedKeys}
      titleRender={(node: TreeDataNode) => (
        node.treeNode?.id === activeId
          ? <CachedTreeNodeEditor dataNode={node} />
          : <CachedTreeNode dataNode={node} />
      )}
    />
  ) : (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={(<>Загрузите элементы,<br /> чтобы начать редактирование</>)}
    />
  )
}
