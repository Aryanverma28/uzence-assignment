import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react'
import { useAsyncTree } from '../../hooks/useAsyncTree'
import { useTreeSelection } from '../../hooks/useTreeSelection'
import { useVirtualizer } from '../../hooks/useVirtualizer'
import { useKeyboardNav } from '../../hooks/useKeyboardNav'
import { ComboboxInput } from './ComboboxInput'
import { ComboboxTags } from './ComboboxTags'
import { ComboboxDropdown } from './ComboboxDropdown'
import type { TreeNode } from '../../types/tree'

export interface ComboboxProps {
  loadData: (parentId: string | null, query: string) => Promise<TreeNode[]>
  onChange?: (selectedIds: string[]) => void
}

export const Combobox: React.FC<ComboboxProps> = ({ loadData, onChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listboxRef = useRef<HTMLDivElement>(null)

  const {
    flattenedTree,
    searchQuery,
    setSearchQuery,
    toggleExpand,
    isLoadingRoot,
    isSearching,
    dataCache,
  } = useAsyncTree({ loadData })

  const {
    selectedIds,
    indeterminateIds,
    toggleSelection,
    removeSelection,
  } = useTreeSelection({ dataCache })

  useEffect(() => {
    if (onChange) {
      onChange(Array.from(selectedIds))
    }
  }, [selectedIds, onChange])

  const ITEM_HEIGHT = 40
  const { virtualItems, totalHeight } = useVirtualizer({
    itemCount: flattenedTree.length,
    itemHeight: ITEM_HEIGHT,
    getScrollElement: useCallback(() => listboxRef.current, []),
  })

  const handleSelectActive = useCallback(
    (index: number) => {
      const node = flattenedTree[index]
      if (node) {
        toggleSelection(node.id)
      }
    },
    [flattenedTree, toggleSelection],
  )

  const handleToggleExpandActive = useCallback(
    (index: number) => {
      const node = flattenedTree[index]
      if (node && node.hasChildren) {
        toggleExpand(node.id)
      }
    },
    [flattenedTree, toggleExpand],
  )

  const { handleKeyDown } = useKeyboardNav({
    itemCount: flattenedTree.length,
    isOpen,
    activeIndex,
    setActiveIndex,
    onSelect: handleSelectActive,
    onToggleExpand: handleToggleExpandActive,
    onClose: () => setIsOpen(false),
    onOpen: () => setIsOpen(true),
  })

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (activeIndex >= 0 && listboxRef.current) {
      const scrollEl = listboxRef.current
      const itemTop = activeIndex * ITEM_HEIGHT
      const itemBottom = itemTop + ITEM_HEIGHT

      if (itemTop < scrollEl.scrollTop) {
        scrollEl.scrollTop = itemTop
      } else if (itemBottom > scrollEl.scrollTop + scrollEl.clientHeight) {
        scrollEl.scrollTop = itemBottom - scrollEl.clientHeight
      }
    }
  }, [activeIndex])

  const tags = useMemo(() => {
    return Array.from(selectedIds).map((id) => ({ id, label: id }))
  }, [selectedIds])

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-lg mx-auto font-sans"
      onKeyDown={handleKeyDown}
    >
      <ComboboxTags tags={tags} onRemove={removeSelection} />
      <ComboboxInput
        ref={inputRef}
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value)
          setIsOpen(true)
          setActiveIndex(0)
        }}
        onClick={() => setIsOpen(true)}
        onToggle={() => {
          setIsOpen((prev) => !prev)
          inputRef.current?.focus()
        }}
        isOpen={isOpen}
        isLoading={isLoadingRoot || isSearching}
        placeholder="Search..."
        aria-activedescendant={
          isOpen && activeIndex >= 0 && flattenedTree[activeIndex]
            ? `combobox-option-${flattenedTree[activeIndex].id}`
            : undefined
        }
      />
      <ComboboxDropdown
        ref={listboxRef}
        isOpen={isOpen}
        nodes={flattenedTree}
        virtualItems={virtualItems}
        totalHeight={totalHeight}
        isLoading={isLoadingRoot || isSearching}
        activeIndex={activeIndex}
        selectedIds={selectedIds}
        indeterminateIds={indeterminateIds}
        onSelect={(id) => {
          toggleSelection(id)
          inputRef.current?.focus()
        }}
        onToggleExpand={(id) => {
          toggleExpand(id)
          inputRef.current?.focus()
        }}
      />
    </div>
  )
}
