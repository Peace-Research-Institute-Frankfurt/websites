import React, { useState } from 'react'

function DetailsGroup({ styles, numbered, children }) {
  return <div className={`${styles.detailsGroup} ${numbered ? styles.numbered : ''}`}>{children}</div>
}

function Details({ styles, summary, children, open }) {
  if (!styles) styles = {}
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
