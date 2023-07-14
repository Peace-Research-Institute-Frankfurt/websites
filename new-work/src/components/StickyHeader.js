import { Link, graphql, useStaticQuery } from 'gatsby'
import React, { useEffect, useState } from 'react'
import useScrollPosition from '@shared/hooks/useScrollPosition'
import * as styles from './StickyHeader.module.scss'

export default function StickyHeader({}) {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)
  const scrollPosition = useScrollPosition()
  const isScrolled = scrollPosition.y > 50
  let scrollProgress = 0
  if (typeof window !== 'undefined') {
    scrollProgress = Math.min(1, scrollPosition.y / (document.body.scrollHeight - window.innerHeight))
  }
  const containerStyles = {
    '--scroll': scrollPosition.y,
    '--progress': scrollProgress,
  }
  return (
    <>
      <header style={containerStyles} className={`${styles.container} ${isScrolled && styles.stuck}`}>
        <div className={styles.copy}>
          <div className={styles.left}>
            <Link className={styles.logo} to="/">
              NW
            </Link>
          </div>
        </div>
      </header>
    </>
  )
}
