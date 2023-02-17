import React from 'react'
import Audio from './Audio'
import MarkdownRenderer from 'react-markdown-renderer'

export default function Quote({ styles, children, cite, type, fullDocument, audio }) {
  if (!styles) styles = {}
  const quoteType = type || 'speech'
  return (
    <blockquote className={`${styles.container} ${styles[quoteType]}`}>
      <div className={styles.text}>{children}</div>
      {cite && (
        <cite className={styles.cite}>
          <MarkdownRenderer markdown={cite} />
        </cite>
      )}
      <div className={styles.actions}>
        {fullDocument && (
          <a className={styles.actionItem} href={fullDocument}>
            Read full document
          </a>
        )}
        {audio && <Audio src={audio} type="minimal" />}
      </div>
    </blockquote>
  )
}
