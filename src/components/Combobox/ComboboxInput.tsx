import React, { forwardRef } from 'react'
import { Search, Loader2 } from 'lucide-react'

export interface ComboboxInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isLoading?: boolean
  isOpen: boolean
  onToggle: () => void
}

export const ComboboxInput = forwardRef<HTMLInputElement, ComboboxInputProps>(
  ({ isLoading, isOpen, onToggle, className = '', ...props }, ref) => {
    return (
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-300 dark:text-surface-800 pointer-events-none">
          {isLoading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Search size={18} />
          )}
        </div>
        <input
          ref={ref}
          type="text"
          className={`w-full pl-10 pr-10 py-2.5 bg-interactive-bg border border-border-color rounded-md shadow-sm text-text-color placeholder-surface-300 focus:outline-none focus:ring-2 focus:ring-focus-ring focus:border-focus-ring transition-colors ${className}`}
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls="combobox-listbox"
          {...props}
        />
        <button
          type="button"
          tabIndex={-1}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-surface-300 hover:text-text-color focus:outline-none focus-visible:ring-2 ring-focus-ring rounded-sm"
          onClick={onToggle}
          aria-label={isOpen ? 'Close suggestions' : 'Open suggestions'}
          aria-expanded={isOpen}
        >
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>
    )
  },
)

ComboboxInput.displayName = 'ComboboxInput'
