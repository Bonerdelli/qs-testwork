import { useState } from 'react'
import { Button, Input } from 'antd'
import {
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons'

import { useStoreActions } from '../../store'
import { TreeNodeProps } from '../TreeNode/types'
import { execOnAntdEvent } from '../../helpers/antd'

import '../DBTreeView/DBTreeNode.css'

export const CachedTreeNodeEditor: React.FC<TreeNodeProps> = ({
  dataNode,
}) => {
  const { treeNode } = dataNode
  const { setNodeValue } = useStoreActions(state => state.cashedTreeNodes)
  const { setActiveId } = useStoreActions(state => state.nodeEdit)
  const [editedValue, setEditedValue] = useState<string>(treeNode?.value ?? '')

  const confirmEdit = () => {
    if (treeNode && editedValue) {
      setNodeValue([treeNode, editedValue])
      setTimeout(() => setActiveId(undefined))
    }
  }

  const cancelEdit = () => {
    setActiveId(undefined)
  }

  const renderActionButtons = () => (
    <div className="tree-node-actions">
      <Button
        type="link"
        shape="circle"
        disabled={!editedValue}
        icon={<CheckOutlined />}
        onClick={execOnAntdEvent(confirmEdit)}
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
        onClick={execOnAntdEvent(cancelEdit)}
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
          onPressEnter={execOnAntdEvent(confirmEdit)}
          style={{
            width: `${editedValue.length * 0.85 + 2}em`,
          }}
        />
      </div>
      {renderActionButtons()}
    </div>
  )
}
