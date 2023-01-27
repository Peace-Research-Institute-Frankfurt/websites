import React from 'react'
import * as styles from './Tooltip.module.scss'

export default function Tooltip({ active, position, children, id, triggerEl }) {
  let containerClass = styles.tooltip
  let offsetY = 0
  if (typeof window !== 'undefined') {
    offsetY = window.scrollY
  }
  if (position === 'top-center') {
    containerClass = styles.tooltipTopCenter
  }
  let containerStyles = {}
  if (triggerEl) {
    const { x, y, width } = triggerEl.getBoundingClientRect()
    containerStyles = {
      top: `${y - 10 + offsetY}px`,
      left: `${x + width / 2}px`,
    }
  }
  return (
    <span style={containerStyles} id={id} role="tooltip" className={`${containerClass} ${active ? styles.active : ''}`}>
      <>{children}</>
      <span className={styles.arrow}></span>
    </span>
  )
}
