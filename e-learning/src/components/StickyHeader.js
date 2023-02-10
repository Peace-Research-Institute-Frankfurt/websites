import React from 'react'
import * as styles from './StickyHeader.module.scss'
import { useScrollPosition } from '@prif/shared'
import BookIcon from '../assets/icons/favicon.svg'
import { Link } from 'gatsby'

export default function StickyHeader({ post, unit, next, prev }) {
  const scrollPosition = useScrollPosition()
  let scrollProgress = 0
  if (typeof window !== 'undefined') {
    scrollProgress = scrollPosition.y / (document.body.scrollHeight - window.innerHeight)
  }
  const showStatusClass = scrollPosition.y > 50 ? styles.statusActive : ''

  return (
    <header className={`${styles.status} ${showStatusClass}`}>
      <Link className={styles.home} to="/">
        <BookIcon />
      </Link>
      <div className={styles.statusLocation}>
        <Link to={`../#chapters`} className={styles.statusUnit}>
          Unit {unit.childMdx.frontmatter.order} &middot; {unit.childMdx.frontmatter.title}
        </Link>
      </div>
      <div className={styles.progress}>
        <div style={{ width: `${scrollProgress * 100}%` }} className={styles.progressInner}></div>
      </div>
      <nav className={styles.statusPagination}>
        {prev && <Link to={`../${prev.childMdx.fields.slug}`}>Previous</Link>}
        {next && <Link to={`../${next.childMdx.fields.slug}`}>Next</Link>}
      </nav>
    </header>
  )
}
