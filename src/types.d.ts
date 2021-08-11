export interface TreeNode {
  id: number
  value: string
  parent: number
  childs?: TreeNode[]
  // TODO: make flags
  // updatedAt: Date
  // isDeleted?: boolean // OR deletedAt
  // TODO: hasChilds и NSTree
}
