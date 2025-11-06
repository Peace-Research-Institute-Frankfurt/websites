import React from 'react'
import Expandable from '@shared/components/Expandable'

function Box({ styles, buttonComponent, title, expandable, children }) {
  if (!styles) styles = {}
  if (typeof expandable === 'undefined') expandable = false

  const inner = (
    <div className={styles.inner}>
      {title && <h3 className={styles.title}>{title}</h3>}
      {children}
    </div>
  )

  return (
    <section className={styles.container}>
      {expandable === true ? (
        <Expandable buttonComponent={buttonComponent}>{inner}</Expandable>
      ) : (
        <>{inner}</>
      )}
    </section>
  )
}

export default Box
