import React from 'react'
import * as styles from './StickyHeader.module.scss'
import { useScrollPosition } from './useScrollPosition'
import BookIcon from '../assets/icons/favicon.svg'
import { Link } from 'gatsby'

export default function StickyHeader({ post, unit, next, prev }) {
  const { scrollY, ..._ } = useScrollPosition()
  let scrollProgress = 0
  if (typeof window !== 'undefined') {
    scrollProgress = scrollY / (document.body.scrollHeight - window.innerHeight)
  }
  const showStatusClass = scrollY > 50 ? styles.statusActive : ''

  return (
    <header className={`${styles.status} ${showStatusClass}`}>
      <div className={styles.statusLocation}>
        <Link className={styles.home} to="/">
          <BookIcon />
        </Link>
        <Link to={`../#chapters`} className={styles.statusUnit}>
          Unit {unit.childMdx.frontmatter.order} &middot; {unit.childMdx.frontmatter.title}
        </Link>
        <span>{post.childMdx.frontmatter.title}</span>
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
