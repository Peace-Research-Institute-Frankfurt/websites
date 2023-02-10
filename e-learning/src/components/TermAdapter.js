import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import { Term } from '@prif/shared'
import TooltipAdapter from './TooltipAdapter'

export default function TermAdapter({ t, ...props }) {
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

  // Let's find our term
  let termNode = null
  data.terms.nodes.forEach((node) => {
    if (node.term_id === t) {
      termNode = node
    }
  })

  return <Term term={termNode} TooltipAdapter={TooltipAdapter} {...props} />
}
