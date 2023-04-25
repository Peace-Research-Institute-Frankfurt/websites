import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'

export default function PrintInstitution({ name }) {
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
    <aside className="institution">
      <span className="eyebrow">Institution</span>
      <h2>{institution.title}</h2>
      <p>{institution.description}</p>
      <ul className="chipGroup">
        <li>Established {institution.established}</li>
        <li>{institution.members.length} Members</li>
      </ul>
    </aside>
  )
}
