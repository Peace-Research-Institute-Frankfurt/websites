import React from 'react'
import * as styles from './ButtonGroup.module.scss'

export default function ButtonGroup({ children }) {
  return <div className={styles.container}>{children}</div>
}
