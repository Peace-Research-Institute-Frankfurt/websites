import React from 'react'
import * as styles from './Number.module.scss'

const Number = ({ n, label }) => {
  return (
    <div className={styles.container}>
      <span className={styles.number}>{n}</span>
      <span className={styles.label}>{label}</span>
    </div>
  )
}

const NumberList = ({ children }) => {
  return <div className={styles.list}>{children}</div>
}

export { Number, NumberList }
