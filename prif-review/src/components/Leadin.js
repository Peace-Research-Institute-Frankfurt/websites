import React from 'react'
import * as styles from './Leadin.module.scss'

export default function Leadin({ children }) {
  return <span className={styles.container}>{children}</span>
}
