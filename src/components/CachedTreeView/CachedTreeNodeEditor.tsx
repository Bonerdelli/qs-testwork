import { useState } from 'react'
import { Button, Input } from 'antd'
import {
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons'

import { useStoreActions } from '../../store'
import { TreeNodeProps } from '../TreeNode/types'

import '../DBTreeView/DBTreeNode.css'

export const CachedTreeNodeEditor: React.FC<TreeNodeProps> = ({
  dataNode,
}) => {
  const { treeNode } = dataNode
  const { setNodeValue } = useStoreActions(state => state.cashedTreeNodes)
  const { setActiveId } = useStoreActions(state => state.nodeEdit)
  const [editedValue, setEditedValue] = useState<string>(treeNode?.value ?? '')
  const confirmEdit = (e: any) => { // MouseEvent
    if (treeNode && editedValue) {
      setNodeValue([treeNode, editedValue])
      setTimeout(() => setActiveId(undefined))
    }
    e.stopPropagation()
  }
  const cancelEdit = (e: any) => { // MouseEvent
    setActiveId(undefined)
    e.stopPropagation()
  }
  const renderActionButtons = () => (
    <div className="tree-node-actions">
      <Button
        type="link"
        shape="circle"
        disabled={!editedValue}
        icon={<CheckOutlined />}
        onClick={confirmEdit}
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
        onClick={cancelEdit}
        title="Отмена"
        size="small"
      />
    </div>
  )
  return (
    <div className="tree-node active">
      <div className="tree-node-edit-input">
        <Input
          size="small"
          defaultValue={treeNode?.value}
          onChange={e => setEditedValue(e.target.value)}
          onPressEnter={e => confirmEdit(e)}
          style={{
            width: `${editedValue.length * 0.85 + 2}em`,
          }}
        />
      </div>
      {renderActionButtons()}
    </div>
  )
}
