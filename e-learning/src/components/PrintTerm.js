import React, { useEffect } from 'react'
import { graphql, useStaticQuery } from 'gatsby'

export default function PrintTerm({ t, children, termsContainer, addTerm }) {
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

  useEffect(() => {
    addTerm(termNode)
  }, [addTerm, termNode])

  return (
    <>
      <span>{children || t}</span>
    </>
  )
}
