import { useState, useEffect } from 'react'
import { Tree } from 'antd'
import { DataNode } from 'antd/es/tree'

import { TreeNode } from '../../types'
import { treeDataToNodes } from '../../helpers/tree'
import { DBTreeItem } from './DBTreeItem'

export interface DBTreeViewProps {
  tree: TreeNode
}

export const DBTreeView: React.FC<DBTreeViewProps> = ({ tree }) => {
  const [treeData, setTreeData] = useState<DataNode[]>()
  useEffect(() => {
    const treeNodes = treeDataToNodes(treeData)
    setTreeData([treeNodes])
  }, [tree])
  return (
    <Tree
      treeData={treeData}
      draggable={false}
      defaultExpandedKeys={[0]}
      titleRender={node => (
        <DBTreeItem nodeId={node.key as number} />
      )}
    />
  )
}
