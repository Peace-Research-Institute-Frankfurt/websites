import React from 'react'
import * as styles from './Notes.module.scss'

export default function Notes({ children }) {
  return <section className={styles.container}>{children}</section>
}
