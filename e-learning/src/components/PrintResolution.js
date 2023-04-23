import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'

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
        }
      }
    }
  `)

  let res = null
  data.resolutions.nodes.forEach((node) => {
    if (node.name === name) {
      res = node
    }
  })

  return (
    <aside className="resolution">
      <span className="eyebrow">Resolution</span>
      <h2>
        {res.title}
        {res.text ? <span>{res.name}</span> : <span>{res.name}</span>}
      </h2>
      <p>{res.description}</p>
      <ul className="chipGroup">
        {res.status === 'adopted' ? <li>Adopted {res.date}</li> : <li>{res.status}</li>}
        <li>{res.meeting}</li>
      </ul>
    </aside>
  )
}
