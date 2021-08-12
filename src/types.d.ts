import { DataNode } from 'antd/es/tree'

export interface TreeNode {
  id: number
  value: string
  parent: number
  childs?: TreeNode[]
  updatedAt?: Date
  deletedAt?: Date
  // TODO: separate with UI model?
  isUpdated?: boolean
  isNew?: boolean
}

export interface TreeDataNode extends DataNode {
  treeNode?: TreeNode
}
