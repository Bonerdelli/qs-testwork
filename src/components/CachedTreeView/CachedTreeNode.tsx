import { TreeNode } from '../../types'

export interface CachedTreeNodeProps {
  nodeId: TreeNode['id']
}

export const CachedTreeNode: React.FC<CachedTreeNodeProps> = ({ nodeId }) => {
  return (
    <>{nodeId}</>
  )
}
