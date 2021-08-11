import { useState, useEffect } from 'react'
import { Tree, Empty } from 'antd'
import { DataNode } from 'antd/es/tree'

import { CachedTreeNode } from './CachedTreeNode'
import { cashedTreeItemsToNodes } from '../../helpers/tree'
import { useStoreState } from '../../store'

export const CachedTreeView: React.FC = () => {
  const { nodes } = useStoreState(state => state.cashedTreeNodes)
  const [treeData, setTreeData] = useState<DataNode[]>()
  useEffect(() => {
    if (nodes) {
      const treeNodes = cashedTreeItemsToNodes(nodes)
      setTreeData(treeNodes)
    }
  }, [nodes])
  return treeData ? (
    <Tree
      treeData={treeData}
      draggable={false}
      defaultExpandedKeys={[0]}
      titleRender={node => (
        <CachedTreeNode dataNode={node} />
      )}
    />
  ) : (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={(<>Загрузите элементы,<br /> чтобы начать редактирование</>)}
    />
  )
}
