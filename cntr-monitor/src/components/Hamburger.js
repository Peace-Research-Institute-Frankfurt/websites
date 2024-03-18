import React from 'react'
import * as styles from './Hamburger.module.scss'

export default function Hamburger({ open }) {
  return (
    <div className={`${styles.burger} ${open ? styles.open : ''}`}>
      <div className={styles.top}></div>
      <div className={styles.beef}></div>
      <div className={styles.bottom}></div>
    </div>
  )
}
