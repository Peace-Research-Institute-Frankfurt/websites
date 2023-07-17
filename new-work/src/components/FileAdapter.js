import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import File from '@shared/components/File'
import * as styles from './File.module.scss'

const FileAdapter = function ({ file, title }) {
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

const FileList = function ({ files }) {
  if (!files) files = []
  if (!styles) styles = {}
  return (
    <ul className={styles.list}>
      {files.map((el) => {
        return <li className={styles.listItem}>{el}</li>
      })}
    </ul>
  )
}

export { FileAdapter, FileList }
