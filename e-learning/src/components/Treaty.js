import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { Expandable } from '@prif/shared'
import { Chip, ChipGroup } from './Chip.js'
import TreatyParticipantGraph from './TreatyParticipantGraph'
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
          legalStatus
          scrapeURL
          participants {
            country {
              cca2
              name {
                common
              }
            }
            events {
              type
              date: date(formatString: "DD MMMM YYYY")
            }
          }
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

  const memberCount = treaty.participants.reduce((prev, country) => {
    const s = ['ratification', 'accession', 'acceptance', 'succession']
    const found = country.events.findIndex((event) => {
      return s.indexOf(event.type) !== -1
    })
    return found !== -1 ? prev + 1 : prev
  }, 0)

  return (
    <section className={styles.container}>
      <Expandable buttonStyles={buttonStyles}>
        <span className={styles.eyebrow}>Treaty</span>
        <h2 className={styles.title}>{treaty.shortTitle || treaty.title}</h2>
        <ChipGroup>
          {treaty.date && <Chip>Entered into force {treaty.date}</Chip>}
          {treaty.legalStatus && <Chip>{treaty.legalStatus}</Chip>}
          <Chip>{memberCount} Member States</Chip>
        </ChipGroup>
        <p className={styles.description}>{treaty.description}</p>
        <TreatyParticipantGraph treaty={treaty} />
      </Expandable>
    </section>
  )
}
