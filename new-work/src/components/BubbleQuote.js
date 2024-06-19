import React from 'react'
import * as styles from './BubbleQuote.module.scss'

const BubbleQuotes = ({ children }) => {
  return <ul className={styles.container}>{children}</ul>
}

const BubbleQuote = ({ children }) => {
  return (
    <li className={styles.bubble}>
      <blockquote>{children}</blockquote>
    </li>
  )
}

export { BubbleQuotes, BubbleQuote }
