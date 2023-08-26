import { Link } from 'gatsby'
import React from 'react'
import useScrollPosition from '@shared/hooks/useScrollPosition'
import * as styles from './StickyHeader.module.scss'
import Logo from './Logo'

export default function StickyHeader() {
  const scrollPosition = useScrollPosition()
  let scrollProgress = 0
  if (typeof window !== 'undefined') {
    scrollProgress = Math.min(1, scrollPosition.y / Math.min(window.innerHeight, document.body.scrollHeight - window.innerHeight))
  }

  return (
    <header className={`${styles.container}`}>
      <Link className={styles.logo} to="/">
        <Logo progress={scrollProgress} />
      </Link>
      <nav className={styles.nav}>
        <Link className={styles.navItem} to="/terms">
          Glossar
        </Link>
      </nav>
    </header>
  )
}
