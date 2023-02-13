import React from 'react'
import * as styles from './Chip.module.scss'

function Chip({ children, color }) {
  return <span className={`${styles.container} ${color && styles[color]}`}>{children}</span>
}
function ChipGroup({ children }) {
  return <p className={styles.group}>{children}</p>
}

export { Chip, ChipGroup }
