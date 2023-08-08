import React from 'react'
import { graphql, useStaticQuery, Link } from 'gatsby'
import Logo from '../images/logo.svg'
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
            <Link to={homePath} className={`${styles.title}`}>
              <span className={styles.label}>{data.site.siteMetadata.title} </span>
              <Logo />
            </Link>
          </li>
          {report && (
            <li>
              <Link className={styles.link} to={`../`}>
                {report.relativeDirectory}
              </Link>
            </li>
          )}
        </ul>
      </nav>
      <div className={styles.controls}>{children}</div>
    </header>
  )
}
