import { DataNode } from 'antd/es/tree'

export interface TreeNode {
  id: number
  value: string
  parent: number
  childs?: TreeNode[]
  updatedAt?: Date
  deletedAt?: Date
  // Flags for local nodes editor
  // TODO: separate with UI model?
  isUpdated?: boolean
  isDeleted?: boolean
  isNew?: boolean
}

export interface TreeDataNode extends DataNode {
  treeNode?: TreeNode
}
