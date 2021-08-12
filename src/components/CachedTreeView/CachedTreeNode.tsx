import { Button, Badge } from 'antd'
import {
  EditOutlined,
  PlusCircleOutlined,
  ClearOutlined,
  DeleteOutlined,
} from '@ant-design/icons'

import { useStoreActions } from '../../store'
import { TreeNodeProps } from '../TreeNode/types'
import { execOnAntdEvent } from '../../helpers/antd'

import '../DBTreeView/DBTreeNode.css'

export const CachedTreeNode: React.FC<TreeNodeProps> = ({
  dataNode,
}) => {
  const { treeNode } = dataNode
  const { unloadNode, removeNode } = useStoreActions(state => state.cashedTreeNodes)
  const { setActiveId } = useStoreActions(state => state.nodeEdit)

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
        icon={<PlusCircleOutlined style={{ color: '#52c41a' }} />}
        onClick={execOnAntdEvent(
          () => setActiveId(treeNode?.id),
        )}
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
      <Button
        type="text"
        shape="circle"
        icon={<ClearOutlined />}
        onClick={execOnAntdEvent(
          () => treeNode && unloadNode(treeNode),
        )}
        title="Выгрузить из кэша"
        size="small"
      />
    </div>
  )

  return (
    <div className="tree-node">
      {treeNode?.isUpdated && <Badge status="warning" className="tree-node-status-badge" />}
      <div className="tree-node-value">{dataNode.title}</div>
      {treeNode && renderActionButtons()}
    </div>
  )
}
