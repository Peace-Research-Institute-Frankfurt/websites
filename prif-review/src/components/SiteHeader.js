import React from 'react'
import { graphql, useStaticQuery, Link } from 'gatsby'
import * as styles from './SiteHeader.module.scss'

export default function SiteHeader({ report, translationData, children }) {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  const homePath = translationData.currentLanguage !== 'de' ? `/${translationData.currentLanguage}` : '/'

  return (
    <header className={styles.container}>
      <nav className={styles.menu}>
        <ul>
          <li>
            <Link to={homePath} className={`${styles.title} ${styles.link}`}>
              {data.site.siteMetadata.title}
            </Link>
          </li>
          {report && (
            <li>
              <Link className={styles.link} to={`../`}>
                {report.childMdx.frontmatter.title}
              </Link>
            </li>
          )}
        </ul>
      </nav>
      <div className="controls">{children}</div>
    </header>
  )
}
