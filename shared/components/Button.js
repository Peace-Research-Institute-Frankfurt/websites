import React from 'react'
import { Spinner } from './Spinner'

export default function Button({ onClick, label, icon, hideLabel, state, styles, priority, size, htmlType }) {
  if (!styles) styles = {}
  if (!priority) priority = 'primary'
  if (!size) size = 'medium'

  return (
    <button
      type={htmlType || 'button'}
      className={`${styles.container} ${icon && styles.hasIcon} ${hideLabel && styles.hideLabel} ${styles[priority]} ${styles[size]} ${
        state && styles[state]
      }`}
      disabled={state === 'disabled'}
      onClick={onClick}
    >
      <span className={styles.label}>{label}</span>
      {icon && <div className={styles.icon}>{icon}</div>}
      {state === 'loading' && <Spinner />}
    </button>
  )
}
