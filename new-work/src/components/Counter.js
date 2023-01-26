import React from 'react'
import * as styles from './Counter.module.scss'

export default function Counter({ n }) {
  return <span className={styles.container}>{n}</span>
}
