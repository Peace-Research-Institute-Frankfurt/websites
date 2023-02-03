import React from 'react'
import * as styles from './Button.module.scss'

export default function Button({ onClick, label, icon, state }) {
  return (
    <button className={`${styles.container} ${icon && styles.hasIcon}`} disabled={state === 'disabled'} onClick={onClick}>
      <span className={styles.label}>{label}</span>
      {icon && <div className={styles.icon}>{icon}</div>}
    </button>
  )
}
