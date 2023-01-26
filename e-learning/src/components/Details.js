import React, { useState } from 'react'
import * as styles from './Details.module.scss'

function DetailsGroup({ children }) {
  return <div className={styles.detailsGroup}>{children}</div>
}

function Details({ summary, children, open }) {
  const [isOpen, setIsOpen] = useState(open || false)

  function toggleOpen(e) {
    e.preventDefault()
    setIsOpen(!isOpen)
  }

  return (
    <details className={styles.container} open={isOpen}>
      <summary onClick={toggleOpen} className={styles.summary}>
        <span className={styles.summaryText}>{summary}</span>
      </summary>
      <div className={styles.body}>{children}</div>
    </details>
  )
}

export { Details, DetailsGroup }
