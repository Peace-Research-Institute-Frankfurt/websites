import React from 'react'
import * as styles from './Print.module.scss'

export default function Chapter({ title, intro, children }) {
  return (
    <section className={styles.chapter}>
      <header className={styles.chapterHeader}>
        <h2 className={styles.chapterTitle}>1. {title}</h2>
        {intro !== 'undefined' && <p className={styles.chapterIntro}>{intro}</p>}
      </header>
      <div className="">{children}</div>
    </section>
  )
}
