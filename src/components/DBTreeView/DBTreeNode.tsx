import { TreeNode } from '../../types'

export interface DBTreeNodeProps {
  nodeId: TreeNode['id']
}

export const DBTreeNode: React.FC<DBTreeNodeProps> = ({ nodeId }) => (
  <>{nodeId}</>
)
