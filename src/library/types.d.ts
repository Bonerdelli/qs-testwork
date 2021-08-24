import { DataNode } from 'antd/es/tree'

export interface TreeNode {
  id: number
  value: string
  parent: number
  childs?: TreeNode[]
  hasChilds?: boolean
  // NOTE: there is no mapping to camelCase for simplify the test work
  updated_at?: Date | null
  deleted_at?: Date | null
  // Flags for local nodes editor
  // TODO: separate with UI model?
  isUpdated?: boolean
  isDeleted?: boolean
  isNew?: boolean
}

export interface TreeDataNode extends DataNode {
  treeNode?: TreeNode
}
