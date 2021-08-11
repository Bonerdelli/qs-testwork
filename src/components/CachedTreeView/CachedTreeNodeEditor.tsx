import { useState } from 'react'
import { Form, Button, Input } from 'antd'
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
    treeNode && setNodeValue([treeNode, editedValue])
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
      <Form
        initialValues={{ title: treeNode?.value }}
        validateTrigger="onChange"
        requiredMark={false}
      >
        <Form.Item
          noStyle
          name="title"
          validateStatus="error"
          className="tree-node-edit-input"
          rules={[{ min: 1 }]}
        >
          <Input
            size="small"
            onChange={e => setEditedValue(e.target.value)}
            onPressEnter={e => confirmEdit(e)}
            style={{
              // width: `${editedValue.length ?? 4}em`,
            }}
          />
        </Form.Item>
      </Form>
      {renderActionButtons()}
    </div>
  )
}
