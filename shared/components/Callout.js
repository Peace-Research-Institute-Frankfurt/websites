import React from 'react'
import Expandable from './Expandable'

function Callout({ styles, buttonComponent, title, children }) {
  if (!styles) styles = {}
  return (
    <section className={styles.container}>
      <Expandable buttonComponent={buttonComponent}>
        <h3 className={styles.title}>{title}</h3>
        {children}
      </Expandable>
    </section>
  )
}

export default Callout
