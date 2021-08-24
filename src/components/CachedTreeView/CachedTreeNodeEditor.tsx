/**
 * Component for displaying cashed tree node in editing mode
 *
 * @author Nekrasov Andrew <bonerdelli@gmail.com>
 * @package qs-test-work
 */

import { useState, useEffect } from 'react'
import { Button, Input } from 'antd'
import {
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons'

import { useStoreActions } from 'library/store'
import { TreeNodeProps } from 'components/TreeNode/types'
import { execOnAntdEvent } from 'library/helpers/antd'

import 'components/TreeNode/TreeNode.css'

export const CachedTreeNodeEditor: React.FC<TreeNodeProps> = ({
  dataNode,
}) => {
  const { treeNode } = dataNode
  const { setNodeValue } = useStoreActions(state => state.cashedTreeNodes)
  const { setEditingId } = useStoreActions(state => state.nodeEdit)

  const [editedValue, setEditedValue] = useState<string>(treeNode?.value ?? '')
  const [initialValue, setInitialValue] = useState<string>()

  useEffect(() => {
    setInitialValue(treeNode?.value)
  }, [])

  useEffect(() => {
    if (treeNode) {
      setNodeValue([treeNode, editedValue])
    }
  }, [editedValue])

  const confirmEdit = () => {
    if (treeNode && editedValue) {
      setInitialValue(editedValue)
      setNodeValue([treeNode, editedValue])
      setTimeout(() => setEditingId(undefined))
    }
  }

  const cancelEdit = () => {
    if (treeNode && initialValue && editedValue !== initialValue) {
      setNodeValue([treeNode, initialValue])
    }
    setEditingId(undefined)
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
          autoFocus
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
