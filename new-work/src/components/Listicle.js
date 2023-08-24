import React from 'react'
import * as styles from './Listicle.module.scss'

const Listicle = ({ children }) => {
  return (
    <section className={styles.container}>
      <ol className={styles.list}>{children}</ol>
    </section>
  )
}

const ListicleItem = ({ title, children }) => {
  return (
    <li className={styles.item}>
      {title && <h2 className={styles.title}>{title}</h2>}
      {children}
    </li>
  )
}

export { Listicle, ListicleItem }
