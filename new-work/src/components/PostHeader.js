import React from 'react'
import * as styles from './PostHeader.module.scss'

export default function PostHeader({ title, intro, eyebrow, image, credit }) {
  return (
    <>
      <div className={styles.image}>{image}</div>
      <header className={`${styles.container}`}>
        {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.intro}>{intro}</div>
      </header>
    </>
  )
}
