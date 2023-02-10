import React, { useEffect, useRef, useState } from 'react'
import useScrollPosition from '../hooks/useScrollPosition'
import useViewport from '../hooks/useViewport'
import { clamp } from './utils'

export default function Tooltip({ styles, active, position, children, id, targetEl }) {
  if (!styles) styles = {}
  let offsetY = 0
  const scrollPosition = useScrollPosition()
  const viewportSize = useViewport()
  const containerRef = useRef()
  const [targetRect, setTargetRect] = useState({})
  useEffect(() => {
    if (targetEl) {
      setTargetRect(targetEl.getBoundingClientRect())
    }
  }, [targetEl, scrollPosition, viewportSize])

  let containerStyles = {}
  let arrowStyles = {}
  if (targetEl) {
    const tr = targetRect
    const cr = containerRef.current.getBoundingClientRect()
    const padding = 10
    const xClamped = clamp(padding, tr.x + tr.width / 2 - cr.width / 2, window.innerWidth - cr.width - tr.width / 2 - padding)
    const yClamped = Math.max(tr.height + 100, tr.y - 12)

    if (position === 'topCenter') {
      containerStyles = { transform: `translateY(${yClamped}px) translateY(-100%) translateX(${xClamped}px)` }
      arrowStyles = { left: `${tr.x - xClamped + tr.width / 2}px` }
    }

    if (position === 'bottomRight') {
      containerStyles = {
        top: `${y + height + offsetY}px`,
        right: `${document.documentElement.clientWidth - right}px`,
      }
    }
  }
  return (
    <span
      ref={containerRef}
      style={containerStyles}
      id={id}
      role="tooltip"
      className={`${styles.container} ${styles[position]} ${active ? styles.active : ''}`}
    >
      {children}
      <span style={arrowStyles} className={styles.arrow}></span>
    </span>
  )
}
