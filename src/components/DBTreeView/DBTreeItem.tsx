import { TreeNode } from '../../types'

export interface DBTreeItemProps {
  nodeId: TreeNode['id']
}

export const DBTreeItem: React.FC<DBTreeItemProps> = ({ nodeId }) => (
  <>{nodeId}</>
)
