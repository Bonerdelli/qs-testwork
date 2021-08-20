/**
 * Component for displaying cashed tree node
 *
 * @author Nekrasov Andrew <bonerdelli@gmail.com>
 * @package qs-test-work
 */

import { Button, Badge, Popconfirm } from 'antd'
import {
  EditOutlined,
  PlusCircleOutlined,
  ClearOutlined,
  DeleteOutlined,
} from '@ant-design/icons'

import { useStoreActions, useStoreState } from 'library/store'
import { TreeNodeProps } from 'components/TreeNode/types'
import { execOnAntdEvent } from 'library/helpers/antd'

import 'components/TreeNode/TreeNode.css'

export const CachedTreeNode: React.FC<TreeNodeProps> = ({
  dataNode,
}) => {
  const { treeNode } = dataNode
  const { lastNodeId } = useStoreState(state => state.cashedTreeNodes)
  const { addChildNode, unloadNode, removeNode } = useStoreActions(state => state.cashedTreeNodes)
  const { setActiveId } = useStoreActions(state => state.nodeEdit)

  const addNode = () => {
    treeNode && addChildNode(treeNode)
    setTimeout(() => setActiveId(lastNodeId + 1))
  }

  const renderStateBage = () => {
    if (treeNode?.isNew) {
      return (
        <Badge status="success" className="tree-node-status-badge" />
      )
    }
    if (treeNode?.isUpdated) {
      return (
        <Badge status="warning" className="tree-node-status-badge" />
      )
    }
    return <></>
  }

  const renderActionButtons = () => (
    <div className="tree-node-actions">
      <Button
        type="text"
        shape="circle"
        icon={<EditOutlined style={{ color: '#faad14' }} />}
        onClick={execOnAntdEvent(
          () => setActiveId(treeNode?.id),
        )}
        title="Редактировать"
        size="small"
      />
      <Button
        type="text"
        shape="circle"
        disabled={treeNode?.isNew}
        icon={<PlusCircleOutlined style={{ color: '#52c41a' }} />}
        onClick={execOnAntdEvent(addNode)}
        title="Добавить"
        size="small"
      />
      <Button
        danger
        type="text"
        shape="circle"
        icon={<DeleteOutlined />}
        onClick={execOnAntdEvent(
          () => treeNode && removeNode(treeNode),
        )}
        title="Удалить"
        size="small"
      />
      <Popconfirm
        placement="bottom"
        disabled={!treeNode?.isUpdated && !treeNode?.isNew}
        title={<>Внесённые изменения будут потеряны<br />Продолжить?</>}
        onConfirm={() => treeNode && unloadNode(treeNode)}
        okText="Да"
        cancelText="Нет"
      >
        <Button
          type="text"
          shape="circle"
          icon={<ClearOutlined />}
          onClick={execOnAntdEvent(
            () => treeNode
              && !treeNode.isUpdated
              && !treeNode.isNew
              && unloadNode(treeNode),
          )}
          title="Выгрузить из кэша"
          size="small"
        />
      </Popconfirm>
    </div>
  )

  return (
    <div className="tree-node">
      {renderStateBage()}
      <div className="tree-node-value">{dataNode.title}</div>
      {treeNode && renderActionButtons()}
    </div>
  )
}
