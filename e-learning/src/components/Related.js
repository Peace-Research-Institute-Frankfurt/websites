import React from 'react'
import { useStaticQuery, graphql, Link } from 'gatsby'
import UnitChip from './UnitChip'
import * as styles from './Related.module.scss'
import { truncate } from './utils'

export default function Related({ unit, chapter }) {
  const data = useStaticQuery(graphql`
    query {
      units: allFile(filter: { extension: { eq: "mdx" }, name: { eq: "index" }, sourceInstanceName: { eq: "luContent" } }) {
        nodes {
          relativeDirectory
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
          relativeDirectory
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
  let chapterNode = null
  let unitNode = null

  unitNode = data.units.nodes.find((el) => {
    return el.relativeDirectory === unit
  })
  if (unit && chapter) {
    chapterNode = data.chapters.nodes.find((el) => {
      return el.relativeDirectory === unit && el.childMdx.frontmatter.order === chapter
    })
  }
  return (
    <aside className={styles.container}>
      <Link className={styles.inner} to={`../..${unitNode.childMdx.fields.slug}${chapterNode.childMdx.fields.slug}`}>
        <span className={styles.label}>See also</span>
        <span className={styles.unit}>
          <span>Unit {unitNode.childMdx.frontmatter.order}, </span>
          <span className={styles.chapter}>Chapter {chapterNode.childMdx.frontmatter.order}</span>
        </span>
        <h4 className={styles.title}>{chapterNode.childMdx.frontmatter.title}</h4>
        <p className={styles.intro}>{truncate(chapterNode.childMdx.frontmatter.intro, 15)}</p>
      </Link>
    </aside>
  )
}
