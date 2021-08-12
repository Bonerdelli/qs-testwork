import { Button, Badge } from 'antd'
import {
  EditOutlined,
  PlusCircleOutlined,
  ClearOutlined,
  DeleteOutlined,
} from '@ant-design/icons'

import { useStoreActions } from '../../store'
import { TreeNodeProps } from '../TreeNode/types'

import '../DBTreeView/DBTreeNode.css'

export const CachedTreeNode: React.FC<TreeNodeProps> = ({
  dataNode,
}) => {
  const { treeNode } = dataNode
  const { unloadNode, removeNode } = useStoreActions(state => state.cashedTreeNodes)
  const { setActiveId } = useStoreActions(state => state.nodeEdit)

  const handleRemoveClick = (e: any) => { // MouseEvent
    treeNode && removeNode(treeNode)
    e.stopPropagation()
  }
  const handleUnloadClick = (e: any) => { // MouseEvent
    treeNode && unloadNode(treeNode)
    e.stopPropagation()
  }
  const handleEditClick = (e: any) => { // MouseEvent
    treeNode && setActiveId(treeNode?.id)
    e.stopPropagation()
  }
  const handleAddClick = (e: any) => { // MouseEvent
    treeNode && setActiveId(treeNode?.id)
    e.stopPropagation()
  }

  const renderActionButtons = () => (
    <div className="tree-node-actions">
      <Button
        type="text"
        shape="circle"
        icon={<EditOutlined style={{ color: '#faad14' }} />}
        onClick={handleEditClick}
        title="Редактировать"
        size="small"
      />
      <Button
        type="text"
        shape="circle"
        icon={<PlusCircleOutlined style={{ color: '#52c41a' }} />}
        onClick={handleAddClick}
        title="Добавить"
        size="small"
      />
      <Button
        danger
        type="text"
        shape="circle"
        icon={<DeleteOutlined />}
        onClick={handleRemoveClick}
        title="Удалить"
        size="small"
      />
      <Button
        type="text"
        shape="circle"
        icon={<ClearOutlined />}
        onClick={handleUnloadClick}
        title="Выгрузить из кэша"
        size="small"
      />
    </div>
  )
  return (
    <div className="tree-node">
      {treeNode?.isUpdated && <Badge status="warning" className="tree-node-status-badge" />}
      <div className="tree-node-value">{dataNode.title}</div>
      {renderActionButtons()}
    </div>
  )
}
