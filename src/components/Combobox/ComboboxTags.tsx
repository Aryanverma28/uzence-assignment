import React from 'react'
import { X } from 'lucide-react'

export interface TagItem {
  id: string
  label: string
}

interface ComboboxTagsProps {
  tags: TagItem[]
  onRemove: (id: string) => void
  disabled?: boolean
}

export const ComboboxTags: React.FC<ComboboxTagsProps> = ({
  tags,
  onRemove,
  disabled,
}) => {
  if (tags.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 mb-2" aria-label="Selected items">
      {tags.map((tag) => (
        <span
          key={tag.id}
          className="inline-flex items-center gap-1 px-2 py-1 text-sm bg-primary-100 text-primary-600 rounded-md shadow-sm border border-primary-50 dark:bg-surface-800 dark:text-primary-50 dark:border-surface-800"
        >
          <span className="max-w-[150px] truncate" title={tag.label}>
            {tag.label}
          </span>
          <button
            type="button"
            className="p-0.5 hover:bg-primary-50/50 rounded-sm focus-visible:outline-2 outline-focus-ring dark:hover:bg-surface-800/50"
            onClick={(e) => {
              e.stopPropagation()
              onRemove(tag.id)
            }}
            disabled={disabled}
            aria-label={`Remove ${tag.label}`}
          >
            <X size={14} aria-hidden />
          </button>
        </span>
      ))}
    </div>
  )
}
