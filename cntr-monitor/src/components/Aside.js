import React from 'react'
import * as styles from './Aside.module.scss'

const Aside = ({ title, children }) => {
  return (
    <aside className={styles.container}>
      {title && <span className={styles.title}>{title}</span>}
      {children}
    </aside>
  )
}

export default Aside
