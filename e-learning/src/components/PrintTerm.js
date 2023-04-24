import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import { createPortal } from 'react-dom'

export default function PrintTerm({ t, children, termsContainer }) {
  const data = useStaticQuery(graphql`
    query TermQuery {
      terms: allTermsJson {
        nodes {
          term_id
          title
          description
        }
      }
    }
  `)

  let termNode = null
  data.terms.nodes.forEach((node) => {
    if (node.term_id === t) {
      termNode = node
    }
  })

  return (
    <>
      <span>{children || t}</span>
      {termsContainer &&
        createPortal(
          <>
            <dt>{termNode.title}</dt>
            <dd>{termNode.description}</dd>
          </>,
          termsContainer
        )}
    </>
  )
}
