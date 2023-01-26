import React from 'react'
import * as styles from './Button.module.scss'
import { Spinner } from './Spinner'

export default function Button({ onClick, label, icon, priority, hideLabel, state, htmlType, className }) {
  const containerClasses = `${styles.container} ${hideLabel && styles.hideLabel} ${icon && styles.hasIcon} ${priority && styles[priority]} ${
    state && styles[state]
  } ${className}`
  return (
    <button className={containerClasses} disabled={state === 'disabled'} onClick={onClick} type={htmlType || 'button'}>
      <span className={styles.label}>{label}</span>
      <div className={styles.icon}>{icon}</div>
      {state === 'loading' && <Spinner />}
    </button>
  )
}
