import React from 'react'

export default function Button({ onClick, label, icon, hideLabel, state, styles, priority, size }) {
  if (!styles) styles = {}
  if (!priority) priority = 'primary'
  if (!size) size = 'medium'
  return (
    <button
      className={`${styles.container} ${icon && styles.hasIcon} ${hideLabel && styles.hideLabel} ${styles[priority]} ${styles[size]}`}
      disabled={state === 'disabled'}
      onClick={onClick}
    >
      <span className={styles.label}>{label}</span>
      {icon && <div className={styles.icon}>{icon}</div>}
    </button>
  )
}
