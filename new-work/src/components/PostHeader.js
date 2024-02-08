import React from 'react'
import * as styles from './PostHeader.module.scss'
import MarkdownRenderer from 'react-markdown-renderer'

export default function PostHeader({ title, eyebrow, intro, media, videoAspectRatio, portrait, credit }) {
  return (
    <header className={`${styles.wrapper} ${media ? styles.hasMedia : ''}`}>
      {media && <div className={styles.media}>{media}</div>}
      <div className={`${styles.container}`}>
        <div className={styles.titleContainer}>
          {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
          <h1 className={`${styles.title} ${title.length > 40 ? styles.isLong : ''}`}>{title}</h1>
          {credit && (
            <aside className={styles.credit}>
              <span>Illustration</span>
              <MarkdownRenderer markdown={credit} />
            </aside>
          )}
        </div>
        {intro && (
          <div className={`${styles.intro} ${portrait ? styles.hasPortrait : ''}`}>
            {portrait && portrait}
            <p>{intro}</p>
          </div>
        )}
      </div>
    </header>
  )
}
