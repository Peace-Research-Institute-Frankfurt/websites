import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { Expandable } from '@prif/shared'
import * as styles from './Institution.module.scss'
import * as buttonStyles from './Button.module.scss'

export default function Institution({ name }) {
  const data = useStaticQuery(graphql`
    query InstitutionQuery {
      institutions: allInstitutionsJson {
        nodes {
          name
          title
          established(formatString: "DD MMMM YYYY")
          description
          members {
            cca2
            name {
              common
            }
          }
          website
        }
      }
    }
  `)

  let institution = null
  data.institutions.nodes.forEach((node) => {
    if (node.name === name) {
      institution = node
    }
  })

  const meta = [<>Established {institution.established}</>, <>{institution.members.length} Members</>]

  return (
    <section className={styles.container}>
      <Expandable buttonStyles={buttonStyles}>
        <span className={styles.eyebrow}>Institution</span>
        <h2 className={styles.title}>{institution.title}</h2>
        <p className={styles.meta}>
          {meta.map((el, i) => {
            return (
              <span key={`meta.${i}`} className={styles.metaItem}>
                {el}
              </span>
            )
          })}
        </p>
        <p>{institution.description}</p>
      </Expandable>
    </section>
  )
}
