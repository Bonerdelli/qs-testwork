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
  useEffect(() => {
    if (nodes) {
      const treeNodes = cashedTreeItemsToNodes(nodes)
      setTreeData(treeNodes)
    }
  }, [nodes])
  return treeData?.length ? (
    <Tree
      treeData={treeData}
      draggable={false}
      defaultExpandedKeys={[0]}
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
