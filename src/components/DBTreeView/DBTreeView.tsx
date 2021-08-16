import { useState, useEffect } from 'react'
import { Tree } from 'antd'

import { TreeNode, TreeDataNode } from '../../types'
import { treeDataToNodes, getLeafNodeKeys } from '../../helpers/tree'
import { antdTreeUseExpandedState } from '../../helpers/antd'
import { useStoreActions } from '../../store'
import { DBTreeNode } from './DBTreeNode'

export interface DBTreeViewProps {
  tree: TreeNode
  loading?: boolean
}

export const DBTreeView: React.FC<DBTreeViewProps> = ({ tree, loading }) => {
  const { loadBranch } = useStoreActions(state => state.dbTree)

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

  const onLoadData = async (node: TreeDataNode): Promise<void> => {
    if (node.children || node.disabled) {
      return
    }
    console.log(node)
    if (node.treeNode) {
      const data = await loadBranch(node.treeNode)
      // if (data.error) {
      // }
      node.disabled = true
      console.log('data', data)
    }
  }

  return (
    <Tree
      disabled={loading}
      treeData={treeData}
      draggable={false}
      loadData={onLoadData}
      expandedKeys={expandedKeys}
      onExpand={antdTreeUseExpandedState(expandedKeys, setExpandedKeys)}
      titleRender={node => (
        <DBTreeNode dataNode={node} />
      )}
    />
  )
}
