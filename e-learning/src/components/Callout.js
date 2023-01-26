import React, { useState } from 'react'
import * as styles from './Callout.module.scss'

function Callout({ title, children }) {
  return (
    <section className={styles.container}>
      <h3>{title}</h3>
      {children}
    </section>
  )
}

export { Callout }
