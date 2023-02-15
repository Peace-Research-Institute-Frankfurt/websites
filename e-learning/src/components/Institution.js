import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { Expandable } from '@prif/shared'
import { Chip, ChipGroup } from './Chip'
import Button from './ButtonAdapter'
import * as styles from './Institution.module.scss'

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
            alpha3
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

  return (
    <section className={styles.container}>
      <Expandable buttonComponent={Button}>
        <span className={styles.eyebrow}>Institution</span>
        <h2 className={styles.title}>{institution.title}</h2>
        <ChipGroup>
          <Chip>Established {institution.established}</Chip>
          <Chip>{institution.members.length} Members</Chip>
        </ChipGroup>
        <p>{institution.description}</p>
      </Expandable>
    </section>
  )
}
