export interface TreeNode {
  id: string
  label: string
  children?: TreeNode[]
  hasChildren?: boolean
}

export interface FlattenedTreeNode {
  id: string
  label: string
  depth: number
  expanded: boolean
  hasChildren: boolean
  parentId: string | null
  path: string[]
  hiddenBySearch: boolean
  searchMatch: boolean
}
