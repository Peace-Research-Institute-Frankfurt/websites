import React, { useId } from 'react'
import * as styles from './Toggle.module.scss'

export default function Toggle({ checked, label, onChange, className, size }) {
  const baseId = useId()
  const handleChange = function (e) {
    onChange()
  }
  return (
    <label className={`${styles.container} ${className ? className : ''} ${size ? styles[size] : ''}`} htmlFor={`toggle-${baseId}`}>
      {label && <span className={styles.label}>{label}</span>}
      <input className={styles.input} type="checkbox" id={`toggle-${baseId}`} checked={checked} onChange={handleChange} />
      <span className={`${styles.outer} ${checked ? styles.isChecked : ''}`}>
        <span className={styles.inner}></span>
      </span>
    </label>
  )
}

Toggle.defaultProps = {
  checked: false,
}
