/**
 * Component for displaying deleted node of cashed tree
 *
 * @author Nekrasov Andrew <bonerdelli@gmail.com>
 * @package qs-test-work
 */

import { Button } from 'antd'
import { ClearOutlined } from '@ant-design/icons'

import { useStoreActions } from 'library/store'
import { TreeNodeProps } from 'components/TreeNode/types'
import { execOnAntdEvent, resolveTreeNodeTitle } from 'library/helpers/antd'

import 'components/TreeNode/TreeNode.css'

export const CachedTreeNodeDisabled: React.FC<TreeNodeProps> = ({
  dataNode,
}) => {
  const { treeNode } = dataNode
  const { unloadNode } = useStoreActions(state => state.cashedTreeNodes)

  const renderActionButtons = () => (
    <div className="tree-node-actions">
      <Button
        type="text"
        shape="circle"
        onClick={execOnAntdEvent(
          () => treeNode && unloadNode(treeNode),
        )}
        icon={<ClearOutlined />}
        title="Выгрузить из кэша"
        size="small"
      />
    </div>
  )
  return (
    <div className="tree-node">
      <div className="tree-node-value disabled">{resolveTreeNodeTitle(dataNode)}</div>
      {renderActionButtons()}
    </div>
  )
}
