import { Link, graphql, useStaticQuery } from 'gatsby'
import React from 'react'
import CrossIcon from '../images/cross.svg'
import EmailShareForm from './EmailShareForm'
import Button from './ButtonAdapter'
import * as styles from './BookmarksList.module.scss'

export default function BookmarksList({ bookmarks, setBookmarks }) {
  const data = useStaticQuery(graphql`
    query {
      posts: allFile(
        filter: { extension: { eq: "mdx" }, sourceInstanceName: { in: ["posts", "pages"] } }
        sort: [{ sourceInstanceName: DESC }, { childMdx: { frontmatter: { order: ASC } } }]
      ) {
        nodes {
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

  // Let's find our posts
  const posts = data.posts.nodes.filter((p) => {
    for (let i = 0; i < bookmarks.length; i++) {
      if (p.childMdx && bookmarks[i].slug === p.childMdx.fields.slug) {
        return true
      }
    }
    return false
  })

  function removeBookmark(slug) {
    setBookmarks((prevBookmarks) => {
      return prevBookmarks.filter((el) => {
        return el.slug !== slug
      })
    })
  }

  const bookmarksItems = posts.map((p) => {
    const slug = p.childMdx.fields.slug
    return (
      <li key={`${slug}`} className={styles.item}>
        <Link to={`/${slug}`} className={styles.link}>
          <span className={styles.title}>{p.childMdx.frontmatter.title}</span>
        </Link>
        <div className={styles.remove}>
          <Button size="small" priority="text" label="Favorit löschen" hideLabel={true} icon={<CrossIcon />} onClick={() => removeBookmark(slug)} />
        </div>
      </li>
    )
  })

  const bookmarksContent = (
    <>
      <ul>{bookmarksItems}</ul>
      <div className={styles.actions}>
        <EmailShareForm posts={posts} />
      </div>
    </>
  )

  const emptyState = <p className={styles.empty}>Wenn du Artikel zu deinen Favoriten hinzufügst, erscheinen sie hier.</p>

  return <aside>{bookmarksItems.length > 0 ? bookmarksContent : emptyState}</aside>
}
