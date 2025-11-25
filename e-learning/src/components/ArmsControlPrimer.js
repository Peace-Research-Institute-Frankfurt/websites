import React from 'react'
import * as styles from './ArmsControlPrimer.module.scss'

export default function ArmsControlPrimer({ title, subtitle, link }) {
  const disclaimer =
    "Interested in more context? This podcast offers additional insights but is external material and not required to complete this course."

  const imageSrc = '/assets/BASE_Arms_Control_Primer.png'
  const imageAlt = 'Arms Control Primer Podcast Banner'

  const podcast = 'APPLE PODCASTS >>>'

  return (
    <div className={styles.wrapper}>
      <div className={styles.disclaimer}>{disclaimer}</div>

      <div className={styles.imageWrapper}>
        <img className={styles.image} src={imageSrc} alt={imageAlt} />

        <div className={styles.overlay}>
          <a href={link} target="_blank" rel="noopener noreferrer" className={styles.title}>
            {title}
          </a>
          <span className={styles.subtitle}>{subtitle}</span>
        </div>
      </div>

      <div className={styles.podcastWrapper}>
        <a href={link} target="_blank" rel="noopener noreferrer" className={styles.podcast}>
            {podcast}
          </a>
      </div>
    </div>
  )
}
