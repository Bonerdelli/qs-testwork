import { DataNode } from 'antd/es/tree'

export interface TreeNode {
  id: number
  value: string
  parent: number
  childs?: TreeNode[]
  hasChilds?: boolean
  // NOTE: there is no mapping back-end model props to camelCase
  // This simplifies test solution, I suppose to add mapping for target solution
  updated_at?: Date | null
  deleted_at?: Date | null
  is_parent_deleted?: boolean
  // Flags for local nodes editor
  // TODO: separate with UI model?
  isUpdated?: boolean
  isDeleted?: boolean
  isNew?: boolean
}

export interface TreeDataNode extends DataNode {
  treeNode?: TreeNode
}
