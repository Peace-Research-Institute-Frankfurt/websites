import React from 'react'
import Expandable from '@shared/components/Expandable'

function Box({ styles, buttonComponent, title, expandable, children, id }) {
  if (!styles) styles = {}
  if (typeof expandable === 'undefined') expandable = false

  const inner = (
    <div className={styles.inner}>
      {title && <h2 className={styles.title}>{title}</h2>}
      {children}
    </div>
  )

  return (
    <section id={id} className={styles.container}>
      {expandable === true ? (
        <Expandable buttonComponent={buttonComponent}>{inner}</Expandable>
      ) : (
        <>{inner}</>
      )}
    </section>
  )
}

export default Box
