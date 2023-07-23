import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import { Link } from 'gatsby-plugin-react-i18next'
import * as styles from './SiteHeader.module.scss'

export default function SiteHeader({ children }) {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)
  return (
    <header className={styles.container}>
      <nav className={styles.menu}>
        <ul>
          <li>
            <Link to="/" className={styles.title}>
              {data.site.siteMetadata.title}
            </Link>
          </li>
          <li>
            <Link to="/">Section Title</Link>
          </li>
        </ul>
      </nav>
      <div className="controls">Bookmarks</div>
    </header>
  )
}
