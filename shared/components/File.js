import { graphql, useStaticQuery } from 'gatsby'
import React from 'react'
import DownloadIcon from '../assets/download.svg'

export default function File({ styles, file, title }) {
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
  return (
    <a download href={fileNode.publicURL} className={styles.container}>
      <div>
        <span>{title}</span>
        <p className={styles.meta}>
          <span className={styles.type}>{fileNode.extension}</span>
          <span>{fileNode.prettySize.replace('.', ',')}</span>
        </p>
      </div>
      <DownloadIcon />
    </a>
  )
}
