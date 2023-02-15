import React from 'react'
import * as styles from './Chip.module.scss'

function Chip({ children, color }) {
  return <span className={`${styles.container} ${color && styles[color]}`}>{children}</span>
}
function ChipGroup({ children }) {
  return <div className={styles.group}>{children}</div>
}

export { Chip, ChipGroup }
