import { graphql, useStaticQuery } from 'gatsby'
import React from 'react'
import DownloadIcon from '../images/download.svg'
import * as styles from './File.module.scss'

export default function File(props) {
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
  let file = null
  data.files.nodes.forEach((f) => {
    if (f.base === props.file) {
      file = f
    }
  })
  return (
    <a download href={file.publicURL} className={styles.container}>
      <div>
        <span>{props.title}</span>
        <p className={styles.meta}>
          <span className={styles.type}>{file.extension}</span>
          <span>{file.prettySize.replace('.', ',')}</span>
        </p>
      </div>
      <DownloadIcon />
    </a>
  )
}
