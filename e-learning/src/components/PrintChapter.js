import React from 'react'
import * as styles from './Print.module.scss'

export default function Chapter({ title, children }) {
  return (
    <section className={styles.chapter}>
      <h2 className={styles.chapterTitle}>Chapter: {title}</h2>
      {children}
    </section>
  )
}
