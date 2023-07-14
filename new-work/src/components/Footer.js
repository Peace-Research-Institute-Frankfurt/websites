import { Link, graphql, useStaticQuery } from 'gatsby'
import React from 'react'
import * as styles from './SiteFooter.module.scss'

export default function Footer() {
  const data = useStaticQuery(graphql`
    query {
      meta: site {
        buildTime(formatString: "D MMMM Y, HH:mm", locale: "de")
      }
      pages: allFile(filter: { extension: { eq: "mdx" }, sourceInstanceName: { eq: "pages" } }, sort: { childMdx: { frontmatter: { order: ASC } } }) {
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
    }
  `)
  return (
    <footer className={styles.container}>
      <nav className={styles.nav}>
        <ul>
          <li>
            <Link to="/">Startseite</Link>
          </li>
          {data.pages.nodes.map((p) => {
            return (
              <li key={`navitem-${p.id}`}>
                <Link to={`../${p.childMdx.fields.slug}`}>{p.childMdx.frontmatter.title}</Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <p className={styles.meta}>© HSFK und die Autor*innen {new Date().getFullYear()}</p>
    </footer>
  )
}
