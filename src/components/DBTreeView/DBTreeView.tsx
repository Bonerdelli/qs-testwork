import { useState, useEffect } from 'react'
import { Tree } from 'antd'

import { TreeNode, TreeDataNode } from '../../types'
import { treeDataToNodes, getLeafNodeKeys } from '../../helpers/tree'
import { antdTreeUseExpandedState } from '../../helpers/antd'
import { DBTreeNode } from './DBTreeNode'

export interface DBTreeViewProps {
  tree: TreeNode
  loading?: boolean
}

export const DBTreeView: React.FC<DBTreeViewProps> = ({ tree, loading }) => {
  const [treeData, setTreeData] = useState<TreeDataNode[]>()
  const [expandedKeys, setExpandedKeys] = useState<number[]>([])

  useEffect(() => {
    const treeNodes = treeDataToNodes(tree)
    if (!expandedKeys.length) {
      const keys = getLeafNodeKeys([treeNodes])
      setExpandedKeys(keys)
    }
    setTreeData([treeNodes])
  }, [tree])

  return (
    <Tree
      disabled={loading}
      treeData={treeData}
      draggable={false}
      expandedKeys={expandedKeys}
      onExpand={antdTreeUseExpandedState(expandedKeys, setExpandedKeys)}
      titleRender={node => (
        <DBTreeNode dataNode={node} />
      )}
    />
  )
}
