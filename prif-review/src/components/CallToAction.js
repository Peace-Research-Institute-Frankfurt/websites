import React from 'react'
import Arrow from '../images/arrow-right.svg'
import * as styles from './CallToAction.module.scss'

const CallToAction = ({ url, children }) => {
  return (
    <aside className={styles.container}>
      <a href={url} className={styles.button}>
        {children}
        <Arrow />
      </a>
    </aside>
  )
}

export { CallToAction }
