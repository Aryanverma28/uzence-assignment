import { useState, useEffect, useCallback, useMemo } from 'react'
import type { TreeNode, FlattenedTreeNode } from '../types/tree'

interface UseAsyncTreeProps {
  loadData: (parentId: string | null, query: string) => Promise<TreeNode[]>
}

export function useAsyncTree({ loadData }: UseAsyncTreeProps) {
  const [dataCache, setDataCache] = useState<Record<string, TreeNode[]>>({})
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const [searchResults, setSearchResults] = useState<TreeNode[] | null>(null)

  const fetchNodes = useCallback(
    async (parentId: string | null, query: string = '') => {
      const lockId = parentId ?? 'root'
      setLoadingIds((prev) => new Set(prev).add(lockId))
      try {
        const nodes = await loadData(parentId, query)

        if (query) {
          setSearchResults(nodes)
        } else {
          setDataCache((prev) => ({ ...prev, [lockId]: nodes }))
        }
      } catch (err) {
        console.error('Failed to load nodes for', parentId, err)
      } finally {
        setLoadingIds((prev) => {
          const next = new Set(prev)
          next.delete(lockId)
          return next
        })
      }
    },
    [loadData],
  )

  useEffect(() => {
    fetchNodes(null)
  }, [fetchNodes])

  useEffect(() => {
    if (!searchQuery) {
      setSearchResults(null)
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    const timeout = setTimeout(() => {
      fetchNodes(null, searchQuery).finally(() => setIsSearching(false))
    }, 300)

    return () => clearTimeout(timeout)
  }, [searchQuery, fetchNodes])

  const toggleExpand = useCallback(
    (id: string) => {
      setExpandedIds((prev) => {
        const next = new Set(prev)
        if (next.has(id)) {
          next.delete(id)
        } else {
          next.add(id)

          if (!dataCache[id]) {
            fetchNodes(id)
          }
        }
        return next
      })
    },
    [dataCache, fetchNodes],
  )

  const flattenedTree = useMemo(() => {
    const result: FlattenedTreeNode[] = []

    const traverse = (
      nodes: TreeNode[],
      depth: number,
      parentId: string | null,
      path: string[],
      forceExpandAll: boolean = false,
    ) => {
      for (const node of nodes) {
        const isExpanded = forceExpandAll || expandedIds.has(node.id)

        const isSearchMatch = searchQuery
          ? node.label.toLowerCase().includes(searchQuery.toLowerCase())
          : false

        result.push({
          id: node.id,
          label: node.label,
          depth,
          expanded: isExpanded,
          hasChildren: node.hasChildren ?? !!node.children?.length,
          parentId,
          path,
          hiddenBySearch: searchQuery ? !isSearchMatch : false,
          searchMatch: isSearchMatch,
        })

        if (isExpanded || forceExpandAll) {
          const children = searchQuery
            ? node.children
            : dataCache[node.id] || []

          if (children && children.length > 0) {
            traverse(
              children,
              depth + 1,
              node.id,
              [...path, node.label],
              forceExpandAll,
            )
          }
        }
      }
    }

    if (searchQuery && searchResults) {
      traverse(searchResults, 0, null, [], true)
    } else {
      const rootNodes = dataCache['root'] || []
      traverse(rootNodes, 0, null, [])
    }

    return result
  }, [dataCache, expandedIds, searchQuery, searchResults])

  return {
    flattenedTree,
    expandedIds,
    loadingIds,
    searchQuery,
    isSearching,
    setSearchQuery,
    toggleExpand,
    isLoadingRoot: loadingIds.has('root') && !dataCache['root'],
    dataCache,
  }
}
