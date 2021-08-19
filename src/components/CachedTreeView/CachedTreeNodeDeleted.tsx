import { Button, Badge, Popconfirm } from 'antd'
import { UndoOutlined, ClearOutlined } from '@ant-design/icons'

import { useStoreActions } from '../../store'
import { TreeNodeProps } from '../TreeNode/types'
import { execOnAntdEvent } from '../../helpers/antd'

import '../TreeNode/TreeNode.css'

export const CachedTreeNodeDeleted: React.FC<TreeNodeProps> = ({
  dataNode,
}) => {
  const { treeNode } = dataNode
  const { restoreNode, unloadNode } = useStoreActions(state => state.cashedTreeNodes)

  const renderActionButtons = () => (
    <div className="tree-node-actions">
      <Button
        type="text"
        shape="circle"
        icon={<UndoOutlined />}
        onClick={execOnAntdEvent(
          () => treeNode && restoreNode(treeNode),
        )}
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
      <Badge status="error" className="tree-node-status-badge" />
      <div className="tree-node-value disabled">{dataNode.title}</div>
      {renderActionButtons()}
    </div>
  )
}
