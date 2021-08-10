import { useState, useEffect } from 'react'
import { Tree, Empty } from 'antd'
import { DataNode } from 'antd/es/tree'

import { TreeNode } from '../../types'
import { treeDataToNodes } from '../../helpers/tree'
import { CachedTreeNode } from './CachedTreeNode'

export interface CachedTreeViewProps {
  tree?: TreeNode
}

export const CachedTreeView: React.FC<CachedTreeViewProps> = ({ tree }) => {
  const [treeData, setTreeData] = useState<DataNode[]>()
  useEffect(() => {
    if (tree) {
      const treeNodes = treeDataToNodes(treeData)
      setTreeData([treeNodes])
    }
  }, [tree])
  return treeData ? (
    <Tree
      treeData={treeData}
      draggable={false}
      defaultExpandedKeys={[0]}
      titleRender={(node) => (
        <CachedTreeNode nodeId={node.key as number} />
      )}
    />
  ) : (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description='Загрузите элементы чтобы начать редактирование'
    />
  )
}
