import { Link } from 'gatsby'
import React, { useState, useEffect } from 'react'
import useScrollPosition from '@shared/hooks/useScrollPosition'
import useLocalStorage from '@shared/hooks/useLocalStorage'
import * as styles from './StickyHeader.module.scss'
import BookmarksList from './BookmarksList'
import BookmarkToggle from './BookmarkToggle'
import Button from './ButtonAdapter'
import Logo from './Logo'

export default function StickyHeader({ post }) {
  const [storedBookmarks, setStoredBookmarks] = useLocalStorage('bookmarks', [])
  const [bookmarks, setBookmarks] = useState([])
  const [bookmarksActive, setBookmarksActive] = useState(false)

  const scrollPosition = useScrollPosition()
  let scrollProgress = 0
  if (typeof window !== 'undefined') {
    scrollProgress = Math.min(1, scrollPosition.y / 800)
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
            Favoriten
          </button>
          {post && <BookmarkToggle className={styles.navItem} post={post} bookmarks={bookmarks} setBookmarks={setStoredBookmarks} />}
        </div>

        <div className={`${styles.bookmarksContainer} ${bookmarksActive && styles.bookmarksContainerActive}`}>
          <div className={styles.bookmarksContainerInner}>
            <BookmarksList bookmarks={bookmarks} setBookmarks={setStoredBookmarks} />
          </div>
        </div>
      </header>
      <button className={`${styles.backdrop} ${bookmarksActive && styles.backdropActive}`} onClick={() => setBookmarksActive(false)}>
        Close Bookmarks
      </button>
    </>
  )
}
