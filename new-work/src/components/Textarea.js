import React from 'react'
import * as styles from './TextArea.module.scss'

const TextArea = function ({ value, name, onChange, maxLength, id, placeholder, required, state }) {
  let counterState = 'default'
  if (maxLength) {
    if (value.length / maxLength > 0.85) {
      counterState = 'warning'
    }
  }

  return (
    <div className={styles.container}>
      <textarea
        maxLength={maxLength}
        onChange={(e) => onChange(name, e.target.value)}
        value={value}
        disabled={state === 'disabled'}
        rows={3}
        id={id}
        placeholder={placeholder}
        required={required}
      />
      {maxLength && <span className={`${styles.remaining} ${styles[counterState]}`}>{maxLength - value.length}</span>}
    </div>
  )
}

export { TextArea }
