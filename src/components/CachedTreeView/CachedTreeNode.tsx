import { useState } from 'react'
import { Button, Input } from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons'

import { useStoreActions } from '../../store'
import { TreeDataNode } from '../../types'

import '../DBTreeView/DBTreeNode.css'

export interface CachedTreeNodeProps {
  dataNode: TreeDataNode
}

export const CachedTreeNode: React.FC<CachedTreeNodeProps> = ({
  dataNode,
}) => {
  const { treeNode } = dataNode
  const { removeNode } = useStoreActions(state => state.cashedTreeNodes)
  const [editMode, setEditMode] = useState<boolean>(false)
  const handleRemoveClick = (e: any) => { // MouseEvent
    treeNode && removeNode(treeNode)
    e.stopPropagation()
  }
  const handleEditClick = (e: any) => { // MouseEvent
    setEditMode(true)
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
  const renderEditButtons = () => (
    <div className="tree-node-actions">
      <Button
        type="link"
        shape="circle"
        icon={<CheckOutlined />}
        onClick={handleEditClick}
        style={{
          color: 'green',
        }}
        title="Сохранить"
        size="small"
      />
      <Button
        type="text"
        shape="circle"
        icon={<CloseOutlined />}
        onClick={handleEditClick}
        title="Отмена"
        size="small"
      />
    </div>
  )
  return (
    <div className="tree-node">
      {editMode ? (
        <>
          <div className="tree-node-edit-input">
            <Input
              size="small"
              defaultValue={treeNode?.value}
            />
          </div>
          {renderEditButtons()}
        </>
      ) : (
        <>
          {dataNode.title}
          {renderActionButtons()}
        </>
      )}
    </div>
  )
}
