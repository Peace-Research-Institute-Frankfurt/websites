import React from 'react'
import ArrowRightIcon from '../images/arrow-right.svg'
import * as styles from './DateChip.module.scss'

export default function DateChip({ date }) {
  const d = date instanceof Date ? date : new Date(date)
  return (
    <span className={styles.container}>
      <ArrowRightIcon />
      {d.toLocaleDateString('de-DE')}
    </span>
  )
}
