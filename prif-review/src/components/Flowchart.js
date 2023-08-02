import React from 'react'
import * as styles from './Flowchart.module.scss'

const Flowchart = ({ title, children }) => {
  return (
    <figure className={styles.container}>
      {title && <figcaption className={styles.title}>{title}</figcaption>}
      <div className={styles.nodes}>{children}</div>
    </figure>
  )
}

const FlowchartNode = ({ eyebrow, title, id, children }) => {
  return (
    <section className={`${styles.department} ${id ? styles[id] : ''}`}>
      <h2 className={styles.departmentTitle}>
        {eyebrow && <span className={styles.departmentEyebrow}>{eyebrow}</span>}
        {title}
      </h2>
      <div className={styles.departmentDescription}>{children}</div>
    </section>
  )
}

export { Flowchart, FlowchartNode }
