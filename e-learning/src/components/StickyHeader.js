import { Link } from 'gatsby'
import React, { useState } from 'react'
import BookIcon from '../assets/icons/favicon.svg'
import { useScrollPosition } from '@prif/shared'
import useLocalStorage from './useLocalStorage'
import * as styles from './StickyHeader.module.scss'
import BookmarksList from './BookmarksList'

export default function StickyHeader({ post, unit, next, prev, bookmarks, setBookmarks }) {
  const scrollPosition = useScrollPosition()
  const [bookmarksActive, setBookmarksActive] = useState(true)

  let scrollProgress = 0
  if (typeof window !== 'undefined') {
    scrollProgress = scrollPosition.y / (document.body.scrollHeight - window.innerHeight)
  }

  const showStatusClass = scrollPosition.y > 10 ? styles.statusActive : ''

  return (
    <header className={`${styles.status} ${showStatusClass}`}>
      <Link className={styles.home} to="/">
        <BookIcon />
        EUNPDC eLearning
      </Link>
      <div className={styles.statusLocation}>
        {unit && (
          <Link to={`../`} className={styles.unit}>
            Unit {unit.childMdx.frontmatter.order}
          </Link>
        )}
        {post && <span className={styles.post}>{post.childMdx.frontmatter.title}</span>}
      </div>
      <div className={styles.progress}>
        <div style={{ width: `${scrollProgress * 100}%` }} className={styles.progressInner}></div>
      </div>
      <div className={styles.actions}>
        <nav className={styles.statusPagination}>
          {prev && <Link to={`../${prev.childMdx.fields.slug}`}>Previous</Link>}
          {next && <Link to={`../${next.childMdx.fields.slug}`}>Next</Link>}
        </nav>
        <button
          onClick={() => {
            setBookmarksActive(!bookmarksActive)
          }}
          className="toggleBookmarks"
        >
          Saved
        </button>
      </div>
      <div className={`${styles.bookmarksContainer} ${bookmarksActive ? styles.bookmarksContainerActive : null}`}>
        <BookmarksList bookmarks={bookmarks} setBookmarks={setBookmarks} />
      </div>
    </header>
  )
}
