import { useState, useMemo, useCallback } from 'react'
import type { TreeNode } from '../types/tree'

export interface UseTreeSelectionProps {
  dataCache: Record<string, TreeNode[]>
}

export function useTreeSelection({ dataCache }: UseTreeSelectionProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [indeterminateIds, setIndeterminateIds] = useState<Set<string>>(
    new Set(),
  )

  const parentMap = useMemo(() => {
    const map = new Map<string, string | null>()
    for (const [parentId, children] of Object.entries(dataCache)) {
      const pId = parentId === 'root' ? null : parentId
      children.forEach((c) => {
        map.set(c.id, pId)
      })
    }
    return map
  }, [dataCache])

  const childrenMap = useMemo(() => {
    const map = new Map<string, string[]>()
    for (const [parentId, children] of Object.entries(dataCache)) {
      const pId = parentId === 'root' ? 'root' : parentId
      map.set(
        pId,
        children.map((c) => c.id),
      )
    }
    return map
  }, [dataCache])

  const toggleSelection = useCallback(
    (id: string) => {
      setSelectedIds((prevSelected) => {
        const nextSelected = new Set(prevSelected)
        const nextIndeterminate = new Set(indeterminateIds)

        const isCurrentlySelected = nextSelected.has(id)
        const targetState = !isCurrentlySelected

        const queue = [id]
        while (queue.length > 0) {
          const current = queue.shift()!
          if (targetState) {
            nextSelected.add(current)
            nextIndeterminate.delete(current)
          } else {
            nextSelected.delete(current)
            nextIndeterminate.delete(current)
          }

          const children = childrenMap.get(current)
          if (children) {
            queue.push(...children)
          }
        }

        let currentParent = parentMap.get(id)
        while (currentParent) {
          const siblings = childrenMap.get(currentParent) || []
          let checkedCount = 0
          let indeterminateCount = 0

          for (const sib of siblings) {
            if (nextSelected.has(sib)) checkedCount++
            if (nextIndeterminate.has(sib)) indeterminateCount++
          }

          if (checkedCount === siblings.length && siblings.length > 0) {
            nextSelected.add(currentParent)
            nextIndeterminate.delete(currentParent)
          } else if (checkedCount > 0 || indeterminateCount > 0) {
            nextSelected.delete(currentParent)
            nextIndeterminate.add(currentParent)
          } else {
            nextSelected.delete(currentParent)
            nextIndeterminate.delete(currentParent)
          }

          currentParent = parentMap.get(currentParent)
        }

        setIndeterminateIds(nextIndeterminate)
        return nextSelected
      })
    },
    [childrenMap, indeterminateIds, parentMap],
  )

  const removeSelection = useCallback(
    (id: string) => {
      if (selectedIds.has(id)) {
        toggleSelection(id)
      }
    },
    [selectedIds, toggleSelection],
  )

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set())
    setIndeterminateIds(new Set())
  }, [])

  return {
    selectedIds,
    indeterminateIds,
    toggleSelection,
    removeSelection,
    clearSelection,
  }
}
