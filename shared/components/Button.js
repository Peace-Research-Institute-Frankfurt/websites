import React, { forwardRef } from 'react'
import { Spinner } from './Spinner'

const Button = forwardRef(function Button({ onClick, label, icon, hideLabel, state, styles, priority, size, htmlType }, ref) {
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
      ref={ref}
    >
      <span className={styles.label}>{label}</span>
      {icon && <div className={styles.icon}>{icon}</div>}
      {state === 'loading' && <Spinner />}
    </button>
  )
})

export default Button
