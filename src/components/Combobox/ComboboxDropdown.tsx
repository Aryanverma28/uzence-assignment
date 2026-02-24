import { forwardRef } from 'react'
import type { FlattenedTreeNode } from '../../types/tree'
import type { VirtualItem } from '../../hooks/useVirtualizer'
import { ComboboxOption } from './ComboboxOption'

export interface ComboboxDropdownProps {
  nodes: FlattenedTreeNode[]
  virtualItems: VirtualItem[]
  totalHeight: number
  isOpen: boolean
  isLoading: boolean
  activeIndex: number
  selectedIds: Set<string>
  indeterminateIds: Set<string>
  onSelect: (id: string) => void
  onToggleExpand: (id: string) => void
}

export const ComboboxDropdown = forwardRef<
  HTMLDivElement,
  ComboboxDropdownProps
>(
  (
    {
      nodes,
      virtualItems,
      totalHeight,
      isOpen,
      isLoading,
      activeIndex,
      selectedIds,
      indeterminateIds,
      onSelect,
      onToggleExpand,
    },
    ref,
  ) => {
    if (!isOpen) return null

    return (
      <div className="absolute z-50 w-full mt-1 bg-interactive-bg border border-border-color rounded-md shadow-lg overflow-hidden flex flex-col">
        {isLoading && nodes.length === 0 ? (
          <div
            className="p-4 text-center text-surface-300 dark:text-surface-800 text-sm"
            role="status"
          >
            Loading...
          </div>
        ) : nodes.length === 0 ? (
          <div
            className="p-4 text-center text-surface-300 dark:text-surface-800 text-sm"
            role="status"
          >
            No results found.
          </div>
        ) : (
          <div
            ref={ref}
            className="w-full overflow-y-auto max-h-[300px] outline-none"
            role="listbox"
            tabIndex={-1}
            aria-multiselectable={true}
            id="combobox-listbox"
          >
            <div
              style={{
                height: `${totalHeight}px`,
                position: 'relative',
                width: '100%',
              }}
            >
              {virtualItems.map((vItem) => {
                const node = nodes[vItem.index]
                if (!node) return null

                return (
                  <ComboboxOption
                    key={node.id}
                    node={node}
                    index={vItem.index}
                    isActive={activeIndex === vItem.index}
                    isSelected={selectedIds.has(node.id)}
                    isIndeterminate={indeterminateIds.has(node.id)}
                    onSelect={() => onSelect(node.id)}
                    onToggleExpand={() => onToggleExpand(node.id)}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      transform: `translateY(${vItem.offsetTop}px)`,
                      height: '40px',
                    }}
                  />
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  },
)

ComboboxDropdown.displayName = 'ComboboxDropdown'
