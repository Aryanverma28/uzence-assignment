import { useState, useEffect, useMemo } from 'react'

export interface VirtualizerOptions {
  itemCount: number
  itemHeight: number
  overscan?: number
  getScrollElement: () => HTMLElement | null
}

export interface VirtualItem {
  index: number
  offsetTop: number
}

export function useVirtualizer({
  itemCount,
  itemHeight,
  overscan = 5,
  getScrollElement,
}: VirtualizerOptions) {
  const [scrollTop, setScrollTop] = useState(0)
  const [containerHeight, setContainerHeight] = useState(0)

  useEffect(() => {
    const scrollElement = getScrollElement()
    if (!scrollElement) return

    setContainerHeight(scrollElement.clientHeight)

    const handleScroll = () => {
      setScrollTop(scrollElement.scrollTop)
    }

    const handleResize = () => {
      setContainerHeight(scrollElement.clientHeight)
    }

    scrollElement.addEventListener('scroll', handleScroll, { passive: true })
    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(scrollElement)

    return () => {
      scrollElement.removeEventListener('scroll', handleScroll)
      resizeObserver.disconnect()
    }
  }, [getScrollElement])

  const { virtualItems, totalHeight } = useMemo(() => {
    const totalHeight = itemCount * itemHeight
    if (itemCount === 0) {
      return { virtualItems: [], totalHeight }
    }

    const effectiveHeight = containerHeight || 800

    const startIndex = Math.max(
      0,
      Math.floor(scrollTop / itemHeight) - overscan,
    )
    const endIndex = Math.min(
      itemCount - 1,
      Math.ceil((scrollTop + effectiveHeight) / itemHeight) + overscan,
    )

    const virtualItems: VirtualItem[] = []
    for (let i = startIndex; i <= endIndex; i++) {
      virtualItems.push({
        index: i,
        offsetTop: i * itemHeight,
      })
    }

    return { virtualItems, totalHeight }
  }, [itemCount, itemHeight, overscan, scrollTop, containerHeight])

  return { virtualItems, totalHeight }
}
