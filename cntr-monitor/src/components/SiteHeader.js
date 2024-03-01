import React from 'react'
import { Link } from 'gatsby'
import Logo from '../images/logo-reverse.svg'
import * as styles from './SiteHeader.module.scss'

export default function SiteHeader({ color, issue, translationData, children }) {
  const homePath = translationData.currentLanguage !== 'de' ? `/${translationData.currentLanguage}/` : '/'

  return (
    <header className={`${styles.container}`} style={{ '--color': color }}>
      <span className={styles.title}>
        <Link to={homePath} className={`${styles.title}`}>
          <Logo />
          <span>Monitor</span>
        </Link>
        {issue && (
          <Link to={`${homePath}${issue.childMdx.frontmatter.year}`} className={styles.year}>
            {issue.childMdx.frontmatter.title}
          </Link>
        )}
      </span>
      <div className={styles.controls}>{children}</div>
    </header>
  )
}
