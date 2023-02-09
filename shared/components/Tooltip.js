import React, { useRef } from 'react'
import { clamp } from './utils'

export default function Tooltip({ styles, active, position, children, id, targetEl }) {
  if (!styles) styles = {}
  let offsetY = 0
  if (typeof window !== 'undefined') {
    // offsetY = window.scrollY
  }
  const containerRef = useRef()
  let containerStyles = {}
  let arrowStyles = {}
  if (targetEl) {
    const tr = targetEl.getBoundingClientRect()
    const cr = containerRef.current.getBoundingClientRect()
    const padding = 10
    const xClamped = clamp(padding, tr.x + tr.width / 2 - cr.width / 2, window.innerWidth - padding - cr.width)
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
