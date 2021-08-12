import { useState, useEffect } from 'react'
import { Tree } from 'antd'

import { TreeNode, TreeDataNode } from '../../types'
import { treeDataToNodes, getLeafNodeKeys } from '../../helpers/tree'
import { DBTreeNode } from './DBTreeNode'

export interface DBTreeViewProps {
  tree: TreeNode
}

export const DBTreeView: React.FC<DBTreeViewProps> = ({ tree }) => {
  const [treeData, setTreeData] = useState<TreeDataNode[]>()
  const [expandedKeys, setExpandedKeys] = useState<number[]>([]) // TODO: make persist state if needed

  useEffect(() => {
    const treeNodes = treeDataToNodes(tree)
    if (!expandedKeys.length) {
      const keys = getLeafNodeKeys([treeNodes])
      setExpandedKeys(keys)
    }
    setTreeData([treeNodes])
  }, [tree])

  const onExpand = (_keys: (number | string)[], event: any) => {
    const newKeys = [...expandedKeys]
    const { expanded, node: { key } } = event
    const keyIndex = expandedKeys.indexOf(key)
    if (!expanded && keyIndex !== -1) {
      newKeys.splice(keyIndex, 1)
    } else if (expanded && keyIndex === -1) {
      newKeys.push(key)
    } else {
      return
    }
    setExpandedKeys(newKeys)
  }

  return (
    <Tree
      treeData={treeData}
      draggable={false}
      expandedKeys={expandedKeys}
      onExpand={onExpand}
      titleRender={node => (
        <DBTreeNode dataNode={node} />
      )}
    />
  )
}
