import React from 'react'
import MarkdownRenderer from 'react-markdown-renderer'
import * as styles from './PageHeader.module.scss'

export default function PageHeader({ title, intro }) {
  return (
    <header className={`${styles.container} ${intro ? styles.hasIntro : ''}`}>
      <h1 className={styles.title}>{title}</h1>
      {intro && (
        <div className={styles.intro}>
          <MarkdownRenderer markdown={intro} />
        </div>
      )}
    </header>
  )
}
