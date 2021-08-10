import { Button } from 'antd'
import { DoubleRightOutlined } from '@ant-design/icons'
import { DataNode } from 'antd/es/tree'

import { TREE_ROOT_NODE_ID } from '../../helpers/tree'

import './DBTreeNode.css'

export interface DBTreeNodeProps {
  dataNode: DataNode
}

export const DBTreeNode: React.FC<DBTreeNodeProps> = ({ dataNode }) => {
  const { key } = dataNode
  const handleLoadClick = (e: any) => { // MouseEvent
    e.stopPropagation()
    console.log('handleLoadClick', key)
  }
  const renderActionButtons = () => (
    <div className="tree-node-actions">
      <Button
        type="link"
        shape="circle"
        icon={<DoubleRightOutlined />}
        onClick={handleLoadClick}
        title="Загрузить для редактирования"
        size="small"
      />
    </div>
  )
  return (
    <div className="tree-node">
      {dataNode.title}
      {key !== TREE_ROOT_NODE_ID && renderActionButtons()}
    </div>
  )
}

// <Tooltip
//   placement="bottom"
//   title="Загрузить для редактирования"
//   mouseEnterDelay={500}
// >
//   <Button
//     type="link"
//     shape="circle"
//     icon={<DoubleRightOutlined />}
//     onClick={handleLoadClick}
//     title=""
//     size="small"
//   />
// </Tooltip>
