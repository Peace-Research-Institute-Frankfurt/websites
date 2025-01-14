import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import PrintTreatyParticipantGraph from './PrintTreatyParticipantGraph.js'
import * as styles from './Treaty.module.scss'

export default function PrintTreaty({ name }) {
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
  if (!treaty) {
    let treaty = null
    data.treaties2.nodes.forEach((node) => {
      if (node.name === name) {
        treaty = node
      }
    })
  }

  if (!treaty) {
    return <p>Treaty not found</p>
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
    <aside className="treaty" style={{ gridColumn: '3/4' }}>
      <svg preserveAspectRatio="none" className="asideBackdrop" width={100} height={100} viewBox="0 0 100 100">
        <rect x={0} y={0} width={100} height={100} />
      </svg>
      <span className="eyebrow">Treaty</span>
      <h2 className={styles.title}>{treaty.shortTitle || treaty.title}</h2>
      <ul className="chipGroup">
        {treaty.date && <li>Effective {treaty.date}</li>}
        {treaty.legalStatus && <li>{treaty.legalStatus}</li>}
        <li>{memberCount} Member States</li>
      </ul>
      <p className={styles.description}>{treaty.description}</p>
      <h3 className={styles.subtitle}>Current Adoption</h3>
      <PrintTreatyParticipantGraph treaty={treaty} candidates={data.countries.nodes} />
    </aside>
  )
}
