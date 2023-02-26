import React from 'react'
import Bylines from './Bylines'
import Balancer from 'react-wrap-balancer'
import * as styles from './PostHeader.module.scss'

export default function PostHeader({ intro, title, color, image, authors, fullHeight }) {
  const headerStyles = {
    '--color': color,
  }
  return (
    <header className={`${styles.container} ${fullHeight && styles.isFullHeight}`} style={headerStyles}>
      <div className={styles.headerCopy}>
        <div className={styles.headerCopyInner}>
          <h1 className={styles.title}>
            <Balancer>{title}</Balancer>
          </h1>
          {intro && <p className={styles.intro}>{intro}</p>}
        </div>
        <div className={styles.meta}>
          <Bylines authors={authors} />
        </div>
      </div>
      {image}
    </header>
  )
}
