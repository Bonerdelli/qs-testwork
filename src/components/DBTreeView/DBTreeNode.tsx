/**
 * Component for displaying database tree item
 *
 * @author Nekrasov Andrew <bonerdelli@gmail.com>
 * @package qs-test-work
 */

import { Button } from 'antd'
import { DoubleRightOutlined } from '@ant-design/icons'

import { TREE_ROOT_NODE_ID } from 'library/helpers/tree'
import { useStoreState, useStoreActions } from 'library/store'
import { TreeDataNode } from 'library/types'
import { execOnAntdEvent } from 'library/helpers/antd'

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

  const renderActionButtons = () => (
    <div className="tree-node-actions">
      <Button
        type="link"
        shape="circle"
        icon={<DoubleRightOutlined />}
        disabled={!treeNode || cashedNodeIds?.includes(treeNode.id)}
        onClick={execOnAntdEvent(
          () => treeNode && loadNode(treeNode),
        )}
        title="Загрузить для редактирования"
        size="small"
      />
    </div>
  )

  return (
    <div className="tree-node">
      <span className="tree-node-value">{dataNode.title}</span>
      {key !== TREE_ROOT_NODE_ID && renderActionButtons()}
    </div>
  )
}
