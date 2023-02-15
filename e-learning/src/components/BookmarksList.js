import { Link, graphql, useStaticQuery } from 'gatsby'
import React from 'react'
import CrossIcon from '../assets/icons/cross.svg'
import Button from './Button'
import * as styles from './BookmarksList.module.scss'

export default function BookmarksList({ bookmarks, setBookmarks }) {
  const data = useStaticQuery(graphql`
    query {
      units: allFile(filter: { extension: { eq: "mdx" }, name: { eq: "index" }, sourceInstanceName: { eq: "luContent" } }) {
        nodes {
          id
          childMdx {
            fields {
              slug
            }
            frontmatter {
              title
              order
            }
          }
        }
      }
      chapters: allFile(filter: { extension: { eq: "mdx" }, sourceInstanceName: { eq: "luContent" } }) {
        nodes {
          id
          relativeDirectory
          childMdx {
            fields {
              slug
            }
            frontmatter {
              title
              intro
              authors {
                frontmatter {
                  name
                }
              }
            }
          }
        }
      }
    }
  `)

  // Let's find our chapters
  const chapters = data.chapters.nodes.filter((node) => {
    for (let i = 0; i < bookmarks.length; i++) {
      if (node.id && bookmarks[i].id === node.id) {
        // Let's find the unit
        return true
      }
    }
    return false
  })

  // console.log(data.units.nodes)
  // console.log(data.chapters.nodes)
  // Let's join the unit here
  chapters.forEach((c) => {
    const unit = data.units.nodes.find((un) => {
      return un.childMdx.fields.slug.replace(/\//g, '') === c.relativeDirectory
    })

    c.unit = unit
  })

  function removeBookmark(id) {
    setBookmarks((prevBookmarks) => {
      return prevBookmarks.filter((el) => {
        return el.id !== id
      })
    })
  }

  const bookmarksItems = chapters.map((p) => {
    const slug = p.childMdx.fields.slug
    return (
      <li key={`${slug}`}>
        <Link className={styles.item} to={`../..${p.unit.childMdx.fields.slug}${slug}`}>
          <span className={styles.eyebrow}>Unit {p.unit.childMdx.frontmatter.order}</span>
          <span className={styles.title}>{p.childMdx.frontmatter.title}</span>
        </Link>
        <button className={styles.remove} onClick={() => removeBookmark(p.id)}>
          Delete
          <CrossIcon />
        </button>
      </li>
    )
  })

  const bookmarksContent = <ul className={styles.list}>{bookmarksItems}</ul>

  const emptyState = <p className={styles.empty}>When you add chapters to your bookmarks they'll appear here.</p>

  return <aside>{bookmarksItems.length > 0 ? bookmarksContent : emptyState}</aside>
}
