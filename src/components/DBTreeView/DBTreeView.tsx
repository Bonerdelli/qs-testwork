import { useState, useEffect } from 'react'
import { Tree } from 'antd'

import { TreeDataNode } from 'library/types'
import { treeDataToNodes, getLeafNodeKeys } from 'library/helpers/tree'
import { antdTreeUseExpandedState } from 'library/helpers/antd'
import { useStoreState, useStoreActions } from 'library/store'
import { DBTreeNode } from './DBTreeNode'

export const DBTreeView: React.FC = () => {
  const { tree, isLoading } = useStoreState(state => state.dbTree)
  const { loadBranch } = useStoreActions(state => state.dbTree)

  const [treeData, setTreeData] = useState<TreeDataNode[]>()
  const [expandedKeys, setExpandedKeys] = useState<number[]>([])

  useEffect(() => {
    if (!tree) {
      return
    }
    const dataNodes = treeDataToNodes(tree)
    if (!expandedKeys.length) {
      const keys = getLeafNodeKeys([dataNodes])
      setExpandedKeys(keys)
    }
    setTreeData([dataNodes])
  }, [tree])

  const onLoadNodeData = async (node: TreeDataNode): Promise<void> => {
    if (node.children || node.disabled) {
      return
    }
    if (node.treeNode) {
      await loadBranch(node.treeNode)
    }
  }

  return (
    <Tree
      disabled={isLoading}
      treeData={treeData}
      draggable={false}
      loadData={onLoadNodeData}
      expandedKeys={expandedKeys}
      onExpand={antdTreeUseExpandedState(expandedKeys, setExpandedKeys)}
      titleRender={node => (
        <DBTreeNode dataNode={node} />
      )}
    />
  )
}
