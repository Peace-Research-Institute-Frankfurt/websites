import React from 'react'
import * as styles from './Tooltip.module.scss'

export default function Tooltip({ active, position, children, id, triggerEl }) {
  let offsetY = 0
  if (typeof window !== 'undefined') {
    offsetY = window.scrollY
  }
  let containerStyles = {}
  if (triggerEl) {
    const { x, y, width, height, right } = triggerEl.getBoundingClientRect()
    if (position === 'topCenter') {
      containerStyles = {
        top: `${y - 10 + offsetY}px`,
        left: `${x + width / 2}px`,
      }
    }
    if (position === 'bottomRight') {
      containerStyles = {
        top: `${y + height + offsetY}px`,
        right: `${document.documentElement.clientWidth - right}px`,
      }
    }
  }
  return (
    <span style={containerStyles} id={id} role="tooltip" className={`${styles.container} ${styles[position]} ${active ? styles.active : ''}`}>
      {children}
      <span className={styles.arrow}></span>
    </span>
  )
}
