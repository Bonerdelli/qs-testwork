/**
 * Component for displaying cashed tree
 *
 * @author Nekrasov Andrew <bonerdelli@gmail.com>
 * @package qs-test-work
 */

import { useState, useEffect } from 'react'
import { Tree } from 'antd'
import { DataNode } from 'antd/es/tree'

import { useStoreState, useStoreActions } from 'library/store'
import { TreeDataNode } from 'library/types'
import { cashedTreeItemsToNodes } from 'library/helpers/tree'
import { antdTreeUseExpandedState } from 'library/helpers/antd'
import { CachedTreeNodeDisabled } from './CachedTreeNodeDisabled'
import { CachedTreeNodeDeleted } from './CachedTreeNodeDeleted'
import { CachedTreeNodeEditor } from './CachedTreeNodeEditor'
import { CachedTreeNode } from './CachedTreeNode'

export const CachedTreeView: React.FC = () => {
  const { nodes } = useStoreState(state => state.cashedTreeNodes)
  const { activeId, editingId } = useStoreState(state => state.nodeEdit)
  const { setActiveId } = useStoreActions(state => state.nodeEdit)

  const [treeData, setTreeData] = useState<DataNode[]>()
  const [expandedKeys, setExpandedKeys] = useState<number[]>([])

  useEffect(() => {
    if (nodes) {
      const treeNodes = cashedTreeItemsToNodes(nodes)
      const keys = nodes.map(node => node.id)
      setTreeData(treeNodes)
      setExpandedKeys(keys)
    } else {
      setTreeData([])
      // setExpandedKeys([])
    }
  }, [nodes])

  const renderNode = (node: TreeDataNode) => {
    if (!node.treeNode) {
      return <></>
    }
    if (node.treeNode.isDeleted) {
      return <CachedTreeNodeDeleted dataNode={node} />
    }
    if (node.treeNode.is_parent_deleted || node.treeNode.deleted_at) {
      // Disable any action for already deleted nodes
      // or for nodes, that has removed parent
      return <CachedTreeNodeDisabled dataNode={node} />
    }
    if (node.treeNode.id === editingId) {
      return <CachedTreeNodeEditor dataNode={node} />
    }
    return <CachedTreeNode dataNode={node} />
  }

  return (
    <Tree
      treeData={treeData}
      draggable={false}
      defaultExpandAll
      expandedKeys={expandedKeys}
      selectedKeys={[activeId ?? 0]}
      onSelect={keys => setActiveId(+keys[0])}
      defaultExpandedKeys={expandedKeys}
      onExpand={antdTreeUseExpandedState(expandedKeys, setExpandedKeys)}
      titleRender={(node: TreeDataNode) => renderNode(node)}
      className="cashed-tree"
    />
  )
}
