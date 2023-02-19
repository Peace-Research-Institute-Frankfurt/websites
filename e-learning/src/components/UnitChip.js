import React from 'react'
import * as styles from './UnitChip.module.scss'

export default function UnitChip({ children }) {
  return (
    <span className={styles.container}>
      <span class={styles.label}>{children}</span>
    </span>
  )
}
