import { DataNode } from 'antd/es/tree'

export interface TreeNode {
  id: number
  value: string
  parent: number
  childs?: TreeNode[]
  isUpdated?: boolean
  updatedAt?: Date
  deletedAt?: Date
}

export interface TreeDataNode extends DataNode {
  treeNode?: TreeNode
}
