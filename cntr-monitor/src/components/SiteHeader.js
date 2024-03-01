import React from 'react'
import { Link } from 'gatsby'
import Logo from '../images/logo-reverse.svg'
import * as styles from './SiteHeader.module.scss'

export default function SiteHeader({ color, translationData, children }) {
  const homePath = translationData.currentLanguage !== 'de' ? `/${translationData.currentLanguage}` : '/'

  return (
    <header className={`${styles.container}`} style={{ '--color': color }}>
      <Link to={homePath} className={`${styles.title}`}>
        <Logo />
        <span>Monitor</span>
        <span className={styles.year}>2024</span>
      </Link>
      <div className={styles.controls}>{children}</div>
    </header>
  )
}
