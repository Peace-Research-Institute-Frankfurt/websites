import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import { Link, useTranslation } from 'gatsby-plugin-react-i18next'
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
      <Link to="/" className="title">
        {data.site.siteMetadata.title}
      </Link>
      <div className="controls">{children}</div>
    </header>
  )
}
