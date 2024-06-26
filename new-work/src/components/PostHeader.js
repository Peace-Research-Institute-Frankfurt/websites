import React from 'react'
import * as styles from './PostHeader.module.scss'
import MarkdownRenderer from 'react-markdown-renderer'

export default function PostHeader({ title, intro, hasIllustration, media, portrait, credits }) {
  const creditEls = credits
    ? credits.map((el, i) => {
        return (
          <li key={`credit.${i}`}>
            <span className={styles.creditsLabel}>{el.label || 'Illustration'}</span>
            <MarkdownRenderer markdown={el.name} />
          </li>
        )
      })
    : false

  return (
    <header
      className={`${styles.wrapper} ${media ? styles.hasMedia : ''} ${!hasIllustration ? styles.hasDefault : ''} ${
        title.length > 40 ? styles.hasLongTitle : ''
      }`}
    >
      {media && <div className={`${styles.media}`}>{media}</div>}
      <div className={`${styles.container}`}>
        <div className={styles.titleContainer}>
          <h1 className={`${styles.title} ${title.length > 40 ? styles.isLong : ''}`}>{title}</h1>
          {creditEls && <ul className={styles.credits}>{creditEls}</ul>}
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
