import React from 'react'
import * as styles from './Embed.module.scss'

function Embed({ src, size, caption, title }) {
  return (
    <figure className={`${styles.container} ${styles[size]}`}>
      <div className={styles.iframeContainer}>
        <iframe title={title} src={src} loading="lazy" allowFullScreen frameBorder="0" />
      </div>
      {caption !== '' && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  )
}
export { Embed }
