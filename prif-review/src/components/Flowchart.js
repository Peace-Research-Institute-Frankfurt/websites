import React from 'react'
import * as styles from './Flowchart.module.scss'

const Flowchart = ({ children }) => {
  return <figure className={styles.container}>{children}</figure>
}

const FlowchartNode = ({ title, children }) => {
  return (
    <section className={styles.department}>
      <h2 className={styles.departmentTitle}>{title}</h2>
      <div className={styles.departmentDescription}>{children}</div>
    </section>
  )
}

export { Flowchart, FlowchartNode }
