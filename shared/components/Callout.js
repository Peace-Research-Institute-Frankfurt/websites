import React from 'react'

function Callout({ styles, title, children }) {
  if (!styles) styles = {}
  return (
    <section className={styles.container}>
      <h3>{title}</h3>
      {children}
    </section>
  )
}

export default Callout
