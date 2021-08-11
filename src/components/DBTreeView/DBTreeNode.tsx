import { Button } from 'antd'
import { DoubleRightOutlined } from '@ant-design/icons'

import { TREE_ROOT_NODE_ID } from '../../helpers/tree'
import { useStoreActions } from '../../store'
import { TreeDataNode } from '../../types'

import './DBTreeNode.css'

export interface DBTreeNodeProps {
  dataNode: TreeDataNode
}

export const DBTreeNode: React.FC<DBTreeNodeProps> = ({
  dataNode,
}) => {
  const { key, treeNode } = dataNode
  const { addNode } = useStoreActions(state => state.cashedTreeNodes)
  const handleLoadClick = (e: any) => { // MouseEvent
    treeNode && addNode(treeNode)
    e.stopPropagation()
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
      <span className="tree-node-value">{dataNode.title}</span>
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
