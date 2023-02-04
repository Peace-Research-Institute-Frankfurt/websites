import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { Expandable } from '@prif/shared'
import * as styles from './Treaty.module.scss'
import * as buttonStyles from './Button.module.scss'

export default function Treaty({ name }) {
  const data = useStaticQuery(graphql`
    query treatyQuery {
      treaties: allTreatiesJson {
        nodes {
          name
          title
          shortTitle
          date: date(formatString: "DD MMMM YYYY")
          description
          members {
            cca2
            events {
              type
              date
            }
          }
          comment
        }
      }
    }
  `)

  let treaty = null
  data.treaties.nodes.forEach((node) => {
    if (node.name === name) {
      treaty = node
    }
  })

  const meta = [<>In force since {treaty.date}</>, <>{treaty.members.length} Members</>]

  return (
    <section className={styles.container}>
      <Expandable buttonStyles={buttonStyles}>
        <span className={styles.eyebrow}>Treaty</span>
        <h2 className={styles.title}>{treaty.shortTitle || treaty.title}</h2>
        <p className={styles.meta}>
          {meta.map((el, i) => {
            return (
              <span key={`meta.${i}`} className={styles.metaItem}>
                {el}
              </span>
            )
          })}
        </p>
        <p>{treaty.description}</p>
        {treaty.comment && <p className={styles.comment}>{treaty.comment}</p>}
      </Expandable>
    </section>
  )
}
