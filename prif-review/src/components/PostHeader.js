import React from 'react'
import MarkdownRenderer from 'react-markdown-renderer'
import * as styles from './PostHeader.module.scss'

const PostHeader = ({ eyebrow, title, intro, heroImage }) => {
  return (
    <header className={styles.container}>
      <div className={styles.inner}>
        {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
        <h1 className={styles.title}>{title}</h1>
        {heroImage && heroImage}
        {intro && (
          <div className={styles.intro}>
            <MarkdownRenderer markdown={intro} />
          </div>
        )}
      </div>
    </header>
  )
}

export default PostHeader
