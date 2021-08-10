export interface DataItem {
  id: number
  value: string
  parent: number
  childs?: DataItem[]
  // TODO: make flags
  // updatedAt: Date
  // isDeleted?: boolean
}
