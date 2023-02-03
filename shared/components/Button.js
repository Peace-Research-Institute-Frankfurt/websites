import React from 'react'

export default function Button({ onClick, label, icon, state, styles }) {
  if (!styles) styles = {}
  return (
    <button className={`${styles.container} ${icon && styles.hasIcon}`} disabled={state === 'disabled'} onClick={onClick}>
      <span className={styles.label}>{label}</span>
      {icon && <div className={styles.icon}>{icon}</div>}
    </button>
  )
}
