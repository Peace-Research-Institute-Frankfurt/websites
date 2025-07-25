import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import Expandable from '@shared/components/Expandable'
import { Chip, ChipGroup } from './Chip.js'
import { TreatyParticipantGraph } from './TreatyParticipantGraph'
import Button from './ButtonAdapter.js'
import * as styles from './Treaty.module.scss'

export default function Treaty({ name }) {
  const data = useStaticQuery(graphql`
    query treatyQuery {
      countries: allCountriesJson {
        nodes {
          alpha2
          alpha3
          name {
            common
            article
            isPlural
          }
        }
      }
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
              alpha2
              alpha3
              name {
                isPlural
                common
                article
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
  if (!treaty){
    return (
      <p>
        Treaty <code>{name}</code> not found
      </p>
    )
  }

  data.countries.nodes.forEach((node) => {
    if (treaty.participants.findIndex((el) => el.country.alpha3 === node.alpha3) !== -1) {
    } else {
      treaty.participants.push({
        country: node,
        events: [],
      })
    }
  })

  treaty.participants.forEach((p) => {
    p.status = p.events[p.events.length - 1]?.type || 'none'
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
      <Expandable buttonComponent={Button}>
        <h2 className={styles.title}>{treaty.title || treaty.shortTitle}</h2>
        <ChipGroup>
          {treaty.date && <Chip>Effective {treaty.date}</Chip>}
          {treaty.legalStatus && <Chip>{treaty.legalStatus}</Chip>}
          <Chip>{memberCount} States Parties</Chip>
        </ChipGroup>
        <p className={styles.description}>{treaty.description}</p>
        <h3 className={styles.subtitle}>Current Adoption</h3>
        <TreatyParticipantGraph treaty={treaty} candidates={data.countries.nodes} />
      </Expandable>
    </section>
  )
}
