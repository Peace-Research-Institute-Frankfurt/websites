import React from 'react'
import MarkdownRenderer from 'react-markdown-renderer'

export default function Quote({ styles, children, cite, type, fullDocument }) {
  const quoteType = type || 'speech'
  return (
    <blockquote className={`${styles.container} ${styles[quoteType]}`}>
      <div className={styles.text}>{children}</div>
      <cite className={styles.cite}>
        <MarkdownRenderer markdown={cite} />
      </cite>
      <div className={styles.actions}>
        {fullDocument && (
          <a className={styles.actionItem} href={fullDocument}>
            Read full document
          </a>
        )}
      </div>
    </blockquote>
  )
}

// {/* {props.audio && <Audio src={props.audio} type="minimal"></Audio>} */}
