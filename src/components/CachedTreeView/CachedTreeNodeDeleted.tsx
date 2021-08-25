/**
 * Component for displaying deleted node of cashed tree
 *
 * @author Nekrasov Andrew <bonerdelli@gmail.com>
 * @package qs-test-work
 */

import { Button, Badge, Popconfirm } from 'antd'
import { UndoOutlined, ClearOutlined } from '@ant-design/icons'

import { useStoreActions } from 'library/store'
import { TreeNodeProps } from 'components/TreeNode/types'
import { execOnAntdEvent } from 'library/helpers/antd'

import { TreeDataNode } from 'library/types'

import 'components/TreeNode/TreeNode.css'

export const CachedTreeNodeDeleted: React.FC<TreeNodeProps> = ({
  dataNode,
}) => {
  const { treeNode } = dataNode
  const { restoreNode, unloadNode } = useStoreActions(state => state.cashedTreeNodes)

  const restoredSubtreeMapper = (item: TreeDataNode) => {
    if (item.treeNode) {
      delete item.treeNode.is_parent_deleted
    }
    if (item.children) {
      item.children.map(restoredSubtreeMapper)
    }
  }

  const handleNodeRestore = () => {
    if (treeNode) {
      restoreNode(treeNode)
      if (dataNode.children) {
        dataNode.children.map(restoredSubtreeMapper)
      }
    }
  }

  const renderActionButtons = () => (
    <div className="tree-node-actions">
      <Button
        type="text"
        shape="circle"
        icon={<UndoOutlined />}
        onClick={execOnAntdEvent(handleNodeRestore)}
        title="Восстановить"
        size="small"
      />
      <Popconfirm
        placement="bottom"
        title={<>Внесённые изменения будут потеряны<br />Продолжить?</>}
        onConfirm={() => treeNode && unloadNode(treeNode)}
        okText="Да"
        cancelText="Нет"
      >
        <Button
          type="text"
          shape="circle"
          icon={<ClearOutlined />}
          title="Выгрузить из кэша"
          size="small"
        />
      </Popconfirm>
    </div>
  )
  return (
    <div className="tree-node">
      {treeNode?.isDeleted && <Badge status="error" className="tree-node-status-badge" />}
      <div className="tree-node-value disabled">{dataNode.title}</div>
      {renderActionButtons()}
    </div>
  )
}
