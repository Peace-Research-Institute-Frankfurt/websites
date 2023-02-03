import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import CheckIcon from '../assets/check.svg'
import CrossIcon from '../assets/cross.svg'
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
          members
          signatories
          date: date(formatString: "DD MMMM YYYY")
          description
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

  const meta = [<>{treaty.date}</>, <>{treaty.members.length} Members</>]

  return (
    <section className={styles.container}>
      <Expandable buttonStyles={buttonStyles}>
        <span className={styles.eyebrow}>Treaty</span>
        <h2 className={styles.title}>
          {treaty.shortTitle || treaty.title}
          {treaty.shortTitle && treaty.title && <span className={styles.longTitle}>{treaty.title}</span>}
        </h2>
        <p className={styles.meta}>
          {meta.map((el, i) => {
            return (
              <span key={`meta.${i}`} className={styles.metaItem}>
                {el}
              </span>
            )
          })}
        </p>
        <p className={styles.description}>{treaty.description}</p>
        {treaty.comment && <p className={styles.comment}>{treaty.comment}</p>}
      </Expandable>
    </section>
  )
}
