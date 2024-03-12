import React from 'react'
import * as styles from './Gallery.module.scss'

export default function Gallery({ children }) {
  return <div className={styles.container}>{children}</div>
}
