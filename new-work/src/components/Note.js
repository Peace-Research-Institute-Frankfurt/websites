import React from 'react'
import * as styles from './Note.module.scss'

export default function Note({ children }) {
  return <aside className={styles.container}>{children}</aside>
}
