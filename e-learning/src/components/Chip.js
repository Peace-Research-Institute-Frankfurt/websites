import React from 'react'
import * as styles from './Chip.module.scss'

function Chip({ children, color, ...props }) {
  return (
    <span className={`${styles.container} ${color && styles[color]}`} {...props}>
      {children}
    </span>
  )
}
function ChipGroup({ children }) {
  return <div className={styles.group}>{children}</div>
}

export { Chip, ChipGroup }
