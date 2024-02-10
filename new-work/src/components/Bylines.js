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

  const copy = (
    <>
      <span className={styles.name}>{fm.name}</span>
      {fm.institution && <span className={styles.institution}> {fm.institution}</span>}
    </>
  )

  return (
    <>
      {author.parent.body.length > 0 && (
        <TooltipAdapter active={isActive} targetEl={authorRef.current} position="topLeft">
          <div className={styles.bio}>
            <MarkdownRenderer markdown={author.parent.body} />
          </div>
        </TooltipAdapter>
      )}
      {author.parent.body.length > 0 ? (
        <button onClick={toggleTooltip} className={`${styles.person} ${isActive ? styles.active : ''}`} ref={authorRef}>
          {copy}
        </button>
      ) : (
        <p className={styles.person}>{copy}</p>
      )}
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
