import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import Term from '@shared/components/Term'
import TooltipAdapter from './TooltipAdapter'
import MarkdownRenderer from 'react-markdown-renderer'

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

  const termNode = data.terms.nodes.find((node) => {
    return node.term_id === t
  })

  return (
    <Term
      term={termNode}
      title={termNode.title}
      description={<MarkdownRenderer markdown={termNode.description} />}
      TooltipAdapter={TooltipAdapter}
      {...props}
    />
  )
}
