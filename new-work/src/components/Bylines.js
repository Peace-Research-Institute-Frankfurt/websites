import React, { useRef, useState } from 'react'
import * as styles from './Bylines.module.scss'
import TooltipAdapter from './TooltipAdapter'
import MarkdownRenderer from 'react-markdown-renderer'

const BylineItem = ({ author }) => {
  const fm = author.frontmatter
  const authorRef = useRef(null)
  const [isActive, setIsActive] = useState(false)
  function toggleTooltip() {
    setIsActive(!isActive)
  }
  return (
    <>
      <TooltipAdapter active={isActive} targetEl={authorRef.current} position="topLeft">
        <div className={styles.bio}>
          <MarkdownRenderer markdown={author.parent.body} />
        </div>
      </TooltipAdapter>
      <button onClick={toggleTooltip} className={`${styles.person} ${isActive ? styles.active : ''}`} ref={authorRef}>
        <span className={styles.name}>{fm.name}</span>
        {fm.institution && <span className={styles.institution}> {fm.institution}</span>}
      </button>
    </>
  )
}

const Bylines = ({ authors }) => {
  if (!authors) return <></>
  const authorEls = authors.map((author, i) => {
    return (
      <li key={`author-${i}`}>
        <BylineItem author={author} />
      </li>
    )
  })

  return (
    <div className={styles.container}>
      <ul>{authorEls}</ul>
    </div>
  )
}

export { Bylines, BylineItem }
