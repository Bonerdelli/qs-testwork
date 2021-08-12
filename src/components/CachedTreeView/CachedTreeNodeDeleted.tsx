import { Button, Badge } from 'antd'
import { UndoOutlined } from '@ant-design/icons'

import { useStoreActions } from '../../store'
import { TreeNodeProps } from '../TreeNode/types'

import '../DBTreeView/DBTreeNode.css'

export const CachedTreeNodeDeleted: React.FC<TreeNodeProps> = ({
  dataNode,
}) => {
  const { treeNode } = dataNode
  const { restoreNode } = useStoreActions(state => state.cashedTreeNodes)

  const handleRestoreClick = (e: any) => { // MouseEvent
    treeNode && restoreNode(treeNode)
    e.stopPropagation()
  }

  const renderActionButtons = () => (
    <div className="tree-node-actions">
      <Button
        type="text"
        shape="circle"
        icon={<UndoOutlined />}
        onClick={handleRestoreClick}
        title="Восстановить"
        size="small"
      />
    </div>
  )
  return (
    <div className="tree-node">
      <Badge status="error" className="tree-node-status-badge" />
      <div className="tree-node-value disabled">{dataNode.title}</div>
      {renderActionButtons()}
    </div>
  )
}
