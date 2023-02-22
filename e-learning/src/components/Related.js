import React from 'react'
import { useStaticQuery, graphql, Link } from 'gatsby'
import * as styles from './Related.module.scss'
import { truncate } from './utils'

export default function Related({ unit, chapter }) {
  if (chapter) chapter = Number(chapter)
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
      chapters: allFile(filter: { sourceInstanceName: { eq: "luContent" }, name: { ne: "index" }, ext: { eq: ".mdx" } }) {
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
  chapterNode = data.chapters.nodes.find((el) => {
    console.log(el)
    return el.relativeDirectory === unitNode.relativeDirectory && el.childMdx.frontmatter.order === chapter
  })

  let linkTarget = `../..${unitNode.childMdx.fields.slug}`
  if (chapterNode) {
    linkTarget += `${chapterNode.childMdx.fields.slug}`
  }
  const targetNode = chapterNode || unitNode

  return (
    <aside className={styles.container}>
      <Link className={styles.inner} to={linkTarget}>
        <span className={styles.label}>See also</span>
        <span className={styles.unit}>
          <span>Unit {unitNode.childMdx.frontmatter.order}</span>
          {chapterNode && <span className={styles.chapter}>/ Chapter {chapterNode.childMdx.frontmatter.order}</span>}
        </span>
        <h4 className={styles.title}>{targetNode.childMdx.frontmatter.title}</h4>
        {targetNode.childMdx.frontmatter.intro && <p className={styles.intro}>{truncate(targetNode.childMdx.frontmatter.intro, 15)}</p>}
      </Link>
    </aside>
  )
}
