import React from 'react'
import { ChevronRight } from 'lucide-react'
import type { FlattenedTreeNode } from '../../types/tree'

export interface ComboboxOptionProps {
  node: FlattenedTreeNode
  index: number
  isActive: boolean
  isSelected: boolean
  isIndeterminate: boolean
  onSelect: () => void
  onToggleExpand: () => void
  style?: React.CSSProperties
}

export const ComboboxOption: React.FC<ComboboxOptionProps> = ({
  node,
  index,
  isActive,
  isSelected,
  isIndeterminate,
  onSelect,
  onToggleExpand,
  style,
}) => {
  const checkboxRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = isIndeterminate
    }
  }, [isIndeterminate])

  const paddingLeft = `${node.depth * 1.5 + 0.5}rem`

  return (
    <div
      role="option"
      aria-selected={isSelected}
      aria-level={node.depth + 1}
      aria-setsize={-1}
      aria-posinset={index + 1}
      id={`combobox-option-${node.id}`}
      style={{ ...style, paddingLeft }}
      className={`absolute top-0 left-0 w-full flex items-center pr-4 py-2 cursor-pointer border-b border-surface-50 dark:border-surface-800 transition-colors ${
        isActive ? 'bg-interactive-hover' : 'bg-interactive-bg'
      } ${node.hiddenBySearch ? 'opacity-50' : 'opacity-100'}`}
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
    >
      <div
        className="w-6 h-6 flex-shrink-0 flex items-center justify-center mr-1"
        onClick={(e) => {
          e.stopPropagation()
          if (node.hasChildren) {
            onToggleExpand()
          }
        }}
      >
        {node.hasChildren ? (
          <button
            type="button"
            tabIndex={-1}
            className={`p-0.5 rounded-sm hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-300 focus:outline-none focus-visible:ring-2 ring-focus-ring transition-transform ${
              node.expanded ? 'rotate-90' : ''
            }`}
            aria-label={
              node.expanded ? `Collapse ${node.label}` : `Expand ${node.label}`
            }
            aria-expanded={node.expanded}
          >
            <ChevronRight size={16} />
          </button>
        ) : (
          <div className="w-4" />
        )}
      </div>

      <div className="flex items-center mr-3 h-full">
        <input
          ref={checkboxRef}
          type="checkbox"
          tabIndex={-1}
          checked={isSelected}
          onChange={() => {}}
          className="w-4 h-4 text-primary-600 rounded border-surface-300 focus:ring-primary-500 cursor-pointer"
          aria-hidden="true"
        />
      </div>

      <div className="flex flex-col flex-1 overflow-hidden h-full justify-center">
        <span
          className={`text-sm truncate ${node.searchMatch ? 'font-bold text-primary-600 dark:text-primary-500' : 'text-text-color'}`}
        >
          {node.label}
        </span>
        {node.path.length > 0 && (
          <span className="text-xs text-surface-300 truncate mt-0.5">
            {node.path.join(' > ')}
          </span>
        )}
      </div>
    </div>
  )
}
