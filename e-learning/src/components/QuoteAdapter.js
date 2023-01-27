import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import { Quote } from '@prif/shared'

export default function QuoteAdapter({ audio, ...props }) {
  const data = useStaticQuery(graphql`
    query {
      files: allFile {
        nodes {
          base
          publicURL
        }
      }
    }
  `)

  let audioFileNode = null
  data.files.nodes.forEach((f) => {
    if (f.base === audio) {
      audioFileNode = f
    }
  })
  return <Quote audio={audioFileNode} {...props} />
}
