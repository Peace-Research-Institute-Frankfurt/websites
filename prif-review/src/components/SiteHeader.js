import React from 'react'
import { Link } from 'gatsby'
import Logo from '../images/logo.svg'
import * as styles from './SiteHeader.module.scss'

export default function SiteHeader({ report, translationData, children }) {
  const homePath = translationData.currentLanguage !== 'de' ? `/${translationData.currentLanguage}` : '/'

  return (
    <header className={styles.container}>
      <div className={styles.inner}>
        <Link to={homePath} className={`${styles.title}`}>
          <Logo />
          <span>Review</span>
        </Link>
        {report && (
          <Link className={styles.report} to={`../`}>
            {report.childMdx.frontmatter.title} {report.relativeDirectory.replace(/(.{2})\/(reports)\//g, '')}
          </Link>
        )}
        <div className={styles.controls}>{children}</div>
      </div>
    </header>
  )
}
