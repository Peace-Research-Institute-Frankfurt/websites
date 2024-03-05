import React from 'react'
import * as styles from './Bylines.module.scss'
import MarkdownRenderer from 'react-markdown-renderer'

const BylineItem = ({ author }) => {
  const fm = author.childMdx.frontmatter

  return (
    <div>
      <span className={styles.name}>{fm.name}</span>
      {fm.institution && (
        <span>
          {fm.role && `${fm.role},`} {fm.institution}
        </span>
      )}
      <MarkdownRenderer markdown={author.childMdx.body} />
    </div>
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
