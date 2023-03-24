import React from 'react'
import Button from './ButtonAdapter'
import CloseIcon from '../assets/icons/close.svg'
import * as styles from './Popover.module.scss'

export default function Popover({ targetEl, isActive, setIsActive, title, children }) {
  console.log(targetEl)

  let containerStyles = {}
  if (targetEl) {
    const { top, right, height } = targetEl.getBoundingClientRect()
    containerStyles = {
      right: `${document.body.clientWidth - right}px`,
      top: `${top + height + 5}px`,
    }
  }

  return (
    <>
      <div style={containerStyles} className={`${styles.container} ${isActive ? styles.containerActive : ''}`}>
        <header className={styles.header}>
          <span className={styles.title}>{title}</span>
          <Button onClick={() => setIsActive(false)} label="Close" priority="ghost" icon={<CloseIcon />} size="small" hideLabel={true} />
        </header>
        {children}
      </div>
      <button className={`${styles.backdrop} ${isActive && styles.backdropActive}`} onClick={() => setIsActive(false)}>
        Close
      </button>
    </>
  )
}
