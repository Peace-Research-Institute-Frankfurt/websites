import React from 'react'
import Expandable from './Expandable'

function Callout({ styles, buttonComponent, title, eyebrow, expandable, children }) {
  if (!styles) styles = {}
  if (typeof expandable === 'undefined') expandable = true

  const inner = (
    <div className={styles.inner}>
      {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
      {title && <h3 className={styles.title}>{title}</h3>}
      {children}
    </div>
  )
  return (
    <section className={styles.container}>
      {expandable === true ? <Expandable buttonComponent={buttonComponent}>{inner}</Expandable> : <>{inner}</>}
    </section>
  )
}

export default Callout
