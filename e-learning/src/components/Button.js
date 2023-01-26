import React from 'react'
import * as styles from './Button.module.scss'

export default function Button({ label, onClick }) {
  return (
    <button onClick={onClick} className={styles.container}>
      {label}
    </button>
  )
}
