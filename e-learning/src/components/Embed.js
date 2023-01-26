import React from 'react'
import * as styles from './Embed.module.scss'

function Embed({ src, size, caption }) {
  return (
    <figure className={`${styles.container} ${styles[size]}`}>
      <div className={styles.iframeContainer}>
        <iframe src={src} loading="lazy" allowFullScreen frameBorder="0"></iframe>
      </div>
      {caption !== '' && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  )
}
export { Embed }
