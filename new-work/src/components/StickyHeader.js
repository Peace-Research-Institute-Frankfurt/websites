import { Link } from 'gatsby'
import React, { useState, useEffect } from 'react'
import useScrollPosition from '@shared/hooks/useScrollPosition'
import useLocalStorage from '@shared/hooks/useLocalStorage'

import Logo from './Logo'
import BookmarksList from './BookmarksList'
import BookmarkToggle from './BookmarkToggle'

import * as styles from './StickyHeader.module.scss'

export default function StickyHeader({ post }) {
  const [storedBookmarks, setStoredBookmarks] = useLocalStorage('nw_bookmarks', [])
  const [bookmarks, setBookmarks] = useState([])
  const [bookmarksActive, setBookmarksActive] = useState(false)

  const scrollPosition = useScrollPosition()
  let scrollProgress = 0
  if (typeof window !== 'undefined') {
    scrollProgress = Math.min(1, scrollPosition.y / (window.innerHeight * 0.75))
  }
  useEffect(() => {
    setBookmarks(storedBookmarks)
  }, [storedBookmarks])

  return (
    <>
      <header className={`${styles.container}`}>
        <Link className={styles.logo} to="/">
          <Logo progress={scrollProgress} />
        </Link>

        <div className={styles.nav}>
          <Link className={styles.navItem} to="/terms">
            Glossar
          </Link>
          <button className={styles.navItem} onClick={() => setBookmarksActive(!bookmarksActive)}>
            Favoriten {bookmarks.length > 0 && `(${bookmarks.length})`}
          </button>
          {post && <BookmarkToggle post={post} bookmarks={bookmarks} setBookmarks={setStoredBookmarks} />}
        </div>

        <div className={`${styles.bookmarksContainer} ${bookmarksActive && styles.bookmarksContainerActive}`}>
          <BookmarksList bookmarks={bookmarks} setBookmarks={setStoredBookmarks} />
        </div>
      </header>
      <button className={`${styles.backdrop} ${bookmarksActive && styles.backdropActive}`} onClick={() => setBookmarksActive(false)}>
        Close Bookmarks
      </button>
    </>
  )
}
