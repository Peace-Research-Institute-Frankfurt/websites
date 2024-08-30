import React from 'react'
import { Link, graphql, useStaticQuery } from 'gatsby'
import Logo from '../images/leibniz-logo.svg'
import * as styles from './SiteFooter.module.scss'

export default function Footer() {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          devFlags {
            key
            value
          }
        }
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

  const activeDevFlags = data.site.siteMetadata.devFlags.filter((flag) => {
    return flag.value === 'true'
  })

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
        <div className={styles.meta}>
          <p>© PRIF und die Autor:innen {new Date().getFullYear()}</p>
          {activeDevFlags.length > 0 && (
            <ul className={styles.flags}>
              {activeDevFlags.map((flag) => {
                return <li key={`flag.${flag.key}`}>{flag.key}</li>
              })}
            </ul>
          )}
        </div>
      </div>
    </footer>
  )
}
