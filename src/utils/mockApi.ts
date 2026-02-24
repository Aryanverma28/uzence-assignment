import type { TreeNode } from '../types/tree'

const generateMockData = (): TreeNode[] => {
  const data: TreeNode[] = []
  for (let i = 0; i < 100; i++) {
    const node: TreeNode = {
      id: `node-${i}`,
      label: `Node ${i}`,
      children: [],
    }
    for (let j = 0; j < 10; j++) {
      const child: TreeNode = {
        id: `node-${i}-${j}`,
        label: `Child ${i}-${j}`,
        children: [],
      }
      for (let k = 0; k < 5; k++) {
        child.children!.push({
          id: `node-${i}-${j}-${k}`,
          label: `Grandchild ${i}-${j}-${k}`,
        })
      }
      node.children!.push(child)
    }
    data.push(node)
  }
  return data
}

export const MOCK_TREE = generateMockData()

export const fetchTreeData = async (
  parentId: string | null,
  searchQuery: string = '',
): Promise<TreeNode[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  if (searchQuery) {
    const filterNodes = (nodes: TreeNode[]): TreeNode[] => {
      const result: TreeNode[] = []
      for (const node of nodes) {
        const matches = node.label
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
        if (node.children) {
          const filteredChildren = filterNodes(node.children)
          if (matches || filteredChildren.length > 0) {
            result.push({
              ...node,
              children:
                filteredChildren.length > 0 ? filteredChildren : undefined,
            })
          }
        } else if (matches) {
          result.push({ ...node })
        }
      }
      return result
    }
    return filterNodes(MOCK_TREE)
  }

  if (!parentId) {
    return MOCK_TREE.map((n) => ({
      ...n,
      children: undefined,
      hasChildren: true,
    })) as any
  }

  const findNode = (nodes: TreeNode[], id: string): TreeNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node
      if (node.children) {
        const found = findNode(node.children, id)
        if (found) return found
      }
    }
    return null
  }

  const node = findNode(MOCK_TREE, parentId)
  if (node && node.children) {
    return node.children.map((n) => ({
      ...n,
      children: undefined,
      hasChildren: !!n.children?.length,
    })) as any
  }
  return []
}
