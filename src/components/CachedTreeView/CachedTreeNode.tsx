import { Button } from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons'

import { useStoreActions } from '../../store'
import { TreeNodeProps } from '../TreeNode/types'

import '../DBTreeView/DBTreeNode.css'

export const CachedTreeNode: React.FC<TreeNodeProps> = ({
  dataNode,
}) => {
  const { treeNode } = dataNode
  const { removeNode } = useStoreActions(state => state.cashedTreeNodes)
  const { setActiveId } = useStoreActions(state => state.nodeEdit)
  const handleRemoveClick = (e: any) => { // MouseEvent
    treeNode && removeNode(treeNode)
    e.stopPropagation()
  }
  const handleEditClick = (e: any) => { // MouseEvent
    treeNode && setActiveId(treeNode?.id)
    e.stopPropagation()
  }
  const renderActionButtons = () => (
    <div className="tree-node-actions">
      <Button
        type="link"
        shape="circle"
        icon={<EditOutlined />}
        onClick={handleEditClick}
        title="Редактировать"
        size="small"
      />
      <Button
        danger
        type="link"
        shape="circle"
        icon={<DeleteOutlined />}
        onClick={handleRemoveClick}
        title="Удалить"
        size="small"
      />
    </div>
  )
  return (
    <div className="tree-node">
      {dataNode.title}
      {renderActionButtons()}
    </div>
  )
}
