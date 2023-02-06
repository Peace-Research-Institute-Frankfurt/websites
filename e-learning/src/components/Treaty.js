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
          legalStatus
          participants {
            cca2
            events {
              type
              date
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
    console.log(country)
    const found = country.events.findIndex((event) => {
      return s.indexOf(event.type) !== -1
    })
    return found !== -1 ? prev + 1 : prev
  }, 0)

  const meta = [<>Established {treaty.date}</>, <>{treaty.legalStatus}</>, <>{memberCount} Members</>]

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
      </Expandable>
    </section>
  )
}
