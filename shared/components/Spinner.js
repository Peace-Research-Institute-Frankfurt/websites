import React from 'react'
import * as styles from './Spinner.module.scss'

const Spinner = function () {
  return (
    <svg className={styles.container} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle className={styles.circle} fill="none" strokeWidth={20} strokeLinecap="round" cx="50" cy="50" r="40"></circle>
    </svg>
  )
}

export { Spinner }
