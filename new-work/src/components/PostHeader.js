import React from 'react'
import Arrow from '../images/arrow-right.svg'
import MarkdownRenderer from 'react-markdown-renderer'
import * as styles from './PostHeader.module.scss'

export default function PostHeader({ title, intro, eyebrow, image, credit }) {
  return (
    <>
      <div className={styles.image}>{image}</div>
      <header className={`${styles.container}`}>
        <div className={styles.titleContainer}>
          {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
          <h1 className={`${styles.title} ${title.length > 30 ? styles.isLong : ''}`}>{title}</h1>
          {credit && (
            <aside className={styles.credit}>
              <Arrow />
              <MarkdownRenderer markdown={credit} />
            </aside>
          )}
        </div>
        <div className={styles.intro}>{intro}</div>
      </header>
    </>
  )
}
