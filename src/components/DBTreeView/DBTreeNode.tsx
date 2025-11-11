/**
 * Component for displaying database tree item
 *
 * @author Nekrasov Andrew <bonerdelli@gmail.com>
 * @package qs-test-work
 */

import { useState, useEffect } from 'react'
import { Button } from 'antd'
import { DoubleRightOutlined } from '@ant-design/icons'

import { TREE_ROOT_NODE_ID } from 'library/helpers/tree'
import { useStoreState, useStoreActions } from 'library/store'
import { TreeDataNode } from 'library/types'
import { execOnAntdEvent, resolveTreeNodeTitle } from 'library/helpers/antd'

import 'components/TreeNode/TreeNode.css'

export interface DBTreeNodeProps {
  dataNode: TreeDataNode
}

export const DBTreeNode: React.FC<DBTreeNodeProps> = ({
  dataNode,
}) => {
  const { key, treeNode } = dataNode
  const { nodeIds: cashedNodeIds } = useStoreState(state => state.cashedTreeNodes)
  const { loadNode } = useStoreActions(state => state.cashedTreeNodes)

  const [disabled, setDisabled] = useState<boolean>()

  useEffect(() => {
    let isDisabled = true
    if (treeNode) {
      isDisabled = treeNode.deleted_at !== null
        || treeNode.is_parent_deleted
        || false
    }
    setDisabled(isDisabled)
  }, [treeNode])

  const renderActionButtons = () => {
    if (key === TREE_ROOT_NODE_ID || disabled) {
      // No actions for the root node,
      // for deleted node or for the node that belongs to deleted branch
      return (
        <></>
      )
    }
    return (
      <div className="tree-node-actions">
        <Button
          type="link"
          shape="circle"
          icon={<DoubleRightOutlined />}
          disabled={!treeNode || cashedNodeIds?.includes(treeNode.id)}
          onClick={execOnAntdEvent(
            () => treeNode && loadNode(treeNode.id),
          )}
          title="Загрузить для редактирования"
          size="small"
        />
      </div>
    )
  }

  const itemClass = disabled ? 'disabled' : ''

  return (
    <div className="tree-node">
      <span className={`tree-node-value ${itemClass}`}>{resolveTreeNodeTitle(dataNode)}</span>
      {renderActionButtons()}
    </div>
  )
}
