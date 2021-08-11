import { useState, useEffect } from 'react'
import { Tree } from 'antd'

import { TreeNode, TreeDataNode } from '../../types'
import { treeDataToNodes } from '../../helpers/tree'
import { DBTreeNode } from './DBTreeNode'

export interface DBTreeViewProps {
  tree: TreeNode
}

export const DBTreeView: React.FC<DBTreeViewProps> = ({ tree }) => {
  const [treeData, setTreeData] = useState<TreeDataNode[]>()
  useEffect(() => {
    const treeNodes = treeDataToNodes(tree)
    setTreeData([treeNodes])
  }, [tree])
  return (
    <Tree
      treeData={treeData}
      draggable={false}
      defaultExpandedKeys={[0]}
      titleRender={node => (
        <DBTreeNode dataNode={node} />
      )}
    />
  )
}
