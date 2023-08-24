import React from 'react'
import { Link } from 'gatsby'
import Logo from '../images/logo.svg'
import * as styles from './SiteHeader.module.scss'

export default function SiteHeader({ report, translationData, children }) {
  const homePath = translationData.currentLanguage !== 'de' ? `/${translationData.currentLanguage}` : '/'

  return (
    <header className={styles.container}>
      <div className={styles.inner}>
      <nav className={styles.menu}>
        <ul>
          <li>
            <Link to={homePath} className={`${styles.title}`}>
              <Logo />
              <span>Review</span>
            </Link>
          </li>
          {report && (
            <li>
              <Link className={styles.link} to={`../`}>
                {report.relativeDirectory.replace(/(.{2})\/(reports)\//g, '')}
              </Link>
            </li>
          )}
        </ul>
      </nav>
      <div className={styles.controls}>{children}</div>
      </div>
    </header>
  )
}
