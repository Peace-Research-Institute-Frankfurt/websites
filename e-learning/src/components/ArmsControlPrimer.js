import React from 'react'
import * as styles from './ArmsControlPrimer.module.scss'

export default function ArmsControlPrimer({ title, subtitle, link }) {
  const disclaimer =
    'Interested in more context? This podcast offers additional insights but is external material and not required to complete this course.'

  return (
    <div className={styles.wrapper}>
      <div className={styles.disclaimer}>{disclaimer}</div>

      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.imageLink}
      >
        <div className={styles.imageWrapper}>
          <img
            className={styles.image}
            src="/assets/BASE_Arms_Control_Primer.png"
            alt="Arms Control Primer Podcast Banner"
          />

          <div className={styles.overlay}>
            <span className={styles.title}>{title}</span>
            <span className={styles.subtitle}>{subtitle}</span>
          </div>
        </div>
      </a>

      <div className={styles.podcastWrapper}>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.podcast}
        >
          TO THE IISS PODCAST &gt;&gt;&gt;
        </a>
      </div>
    </div>
  )
}
