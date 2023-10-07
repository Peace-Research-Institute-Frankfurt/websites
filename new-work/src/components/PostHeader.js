import React from 'react'
import * as styles from './PostHeader.module.scss'
import MarkdownRenderer from 'react-markdown-renderer'

export default function PostHeader({ title, intro, image, video, portrait, credit }) {
  return (
    <header className={`${styles.wrapper} ${video ? styles.hasVideo : ''} ${image ? styles.hasImage : ''}`}>
      {video && <div className={styles.video}>{video}</div>}
      {image && <div className={styles.image}>{image}</div>}
      <div className={`${styles.container}`}>
        <div className={styles.titleContainer}>
          <h1 className={`${styles.title} ${title.length > 25 ? styles.isLong : ''}`}>{title}</h1>
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
