import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import { File } from '@prif/shared'

export default function FileAdapter({ styles, file, title }) {
  if (!styles) styles = {}
  const data = useStaticQuery(graphql`
    query {
      files: allFile {
        nodes {
          relativePath
          base
          name
          extension
          publicURL
          prettySize
        }
      }
    }
  `)

  // Let's find our file
  let fileNode = null
  data.files.nodes.forEach((f) => {
    if (f.base === file) {
      fileNode = f
    }
  })

  return <File styles={styles} fileNode={fileNode} title={title} />
}
