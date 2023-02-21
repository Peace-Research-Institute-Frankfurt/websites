import React from 'react'
import { useStaticQuery, graphql, Link } from 'gatsby'
import * as styles from './Related.module.scss'

export default function Related({ unit, chapter }) {
  const data = useStaticQuery(graphql`
    query {
      units: allFile(filter: { extension: { eq: "mdx" }, name: { eq: "index" }, sourceInstanceName: { eq: "luContent" } }) {
        nodes {
          childMdx {
            fields {
              slug
            }
            frontmatter {
              title
              intro
              order
            }
          }
        }
      }
      chapters: allFile(filter: { name: { ne: "index" }, ext: { eq: ".mdx" } }) {
        nodes {
          childMdx {
            fields {
              slug
            }
            frontmatter {
              title
              intro
              order
            }
          }
        }
      }
    }
  `)
  // Let's find the piece of content we want to link to
  let relatedNode = null
  if (unit && !chapter) {
    relatedNode = data.units.nodes.find((el) => {
      return el.childMdx.frontmatter.order === unit
    })
  } else if (unit && chapter) {
    relatedNode = data.chapters.nodes.find((el) => {
      return el.childMdx.frontmatter.order === chapter
    })
  }
  return (
    <aside className={styles.container}>
      <Link className={styles.inner} to={`../${relatedNode.childMdx.fields.slug}`}>
        <span className={styles.label}>{chapter ? 'Related Chapter' : 'Related Unit'}</span>
        <h4 className={styles.title}>{relatedNode.childMdx.frontmatter.title}</h4>
        <p>{JSON.stringify(relatedNode)}</p>
      </Link>
    </aside>
  )
}
