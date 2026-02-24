import type { KeyboardEvent } from 'react'

interface UseKeyboardNavProps {
  itemCount: number
  isOpen: boolean
  activeIndex: number
  setActiveIndex: (index: number) => void
  onSelect: (index: number) => void
  onToggleExpand: (index: number) => void
  onClose: () => void
  onOpen: () => void
}

export function useKeyboardNav({
  itemCount,
  isOpen,
  activeIndex,
  setActiveIndex,
  onSelect,
  onToggleExpand,
  onClose,
  onOpen,
}: UseKeyboardNavProps) {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onOpen()
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex(
          activeIndex < itemCount - 1 ? activeIndex + 1 : activeIndex,
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex(activeIndex > 0 ? activeIndex - 1 : 0)
        break
      case 'ArrowRight':
        e.preventDefault()
        if (activeIndex >= 0) {
          onToggleExpand(activeIndex)
        }
        break
      case 'ArrowLeft':
        e.preventDefault()
        if (activeIndex >= 0) {
          onToggleExpand(activeIndex)
        }
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (activeIndex >= 0 && activeIndex < itemCount) {
          onSelect(activeIndex)
        }
        break
      case 'Escape':
        e.preventDefault()
        onClose()
        break
      case 'Tab':
        onClose()
        break
      case 'Home':
        e.preventDefault()
        setActiveIndex(0)
        break
      case 'End':
        e.preventDefault()
        setActiveIndex(itemCount - 1)
        break
    }
  }

  return { handleKeyDown }
}
