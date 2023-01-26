import React from 'react'
import MarkdownRenderer from 'react-markdown-renderer'
import * as styles from './Quote.module.scss'

export default function Quote({ children, cite }) {
  return (
    <blockquote className={styles.container}>
      <div className={styles.text}>{children}</div>
      <cite className={styles.cite}>
        <MarkdownRenderer markdown={cite} />
      </cite>
    </blockquote>
  )
}
