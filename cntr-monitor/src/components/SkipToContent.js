import React from 'react'
import * as styles from './SkipToContent.module.scss'

export default function SkipToContent() {
  return (
    <a className={styles.container} href="#content">
      Zum Inhalt springen
    </a>
  )
}
