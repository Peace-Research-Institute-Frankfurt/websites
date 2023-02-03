import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import * as styles from './Resolution.module.scss'

export default function Resolution({ name }) {
  const data = useStaticQuery(graphql`
    query ResolutionQuery {
      resolutions: allResolutionsJson {
        nodes {
          name
          title
          meeting
          date: date(formatString: "DD MMMM YYYY")
          status
          text
          description
          comment
        }
      }
    }
  `)

  // Let's find our term
  let res = null
  data.resolutions.nodes.forEach((node) => {
    if (node.name === name) {
      res = node
    }
  })

  const meta = [
    { label: 'Introduced', data: res.date },
    { label: 'Meeting', data: res.meeting },
    { label: 'Status', data: res.status },
  ]

  return (
    <section className={styles.container}>
      <span className={styles.eyebrow}>Resolution</span>
      <h2 className={styles.title}>{res.title}</h2>
      <p className={styles.meta}>
        {meta.map((el) => {
          return (
            <span key={el.label} className={styles.metaItem}>
              {el.data}
            </span>
          )
        })}
      </p>
      <p className={styles.description}>{res.description}</p>
      <p className={styles.actions}>
        <a href={res.text}>Full text</a>
      </p>
    </section>
  )
}
