import React from 'react'
import { Link, graphql, useStaticQuery } from 'gatsby'
import Logo from '../images/leibniz-logo.svg'
import * as styles from './SiteFooter.module.scss'

export default function Footer() {
  const data = useStaticQuery(graphql`
    query {
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
      <div className={styles.logo}>
        <Logo />
      </div>
      <div>
        <nav className={styles.nav}>
          <ul>
            <li>
              <Link className={styles.link} to="/">
                Startseite
              </Link>
            </li>
            {data.pages.nodes.map((p) => {
              return (
                <li key={`navitem-${p.id}`}>
                  <Link className={styles.link} to={`../${p.childMdx.fields.slug}`}>
                    {p.childMdx.frontmatter.title}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        <p className={styles.meta}>
          <span>© PRIF und die Autor*innen {new Date().getFullYear()}</span>
        </p>
      </div>
    </footer>
  )
}
