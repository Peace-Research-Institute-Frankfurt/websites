import React from 'react'
import Button from './ButtonAdapter'
import CloseIcon from '../assets/icons/close.svg'
import * as styles from './Popover.module.scss'

export default function Popover({ trigger, isActive, setIsActive, title, children }) {
  let containerStyles = {}
  return (
    <>
      <details style={containerStyles} className={`${styles.container} ${isActive ? styles.containerActive : ''}`} open={isActive}>
        <summary className={styles.summary}>{trigger}</summary>
        <div className={styles.content}>
          <header className={styles.header}>
            <span className={styles.title}>{title}</span>
            <Button onClick={() => setIsActive(false)} label="Close" priority="ghost" icon={<CloseIcon />} size="small" hideLabel={true} />
          </header>
          {children}
        </div>
      </details>
      <button className={`${styles.backdrop} ${isActive && styles.backdropActive}`} onClick={() => setIsActive(false)}>
        Close
      </button>
    </>
  )
}
