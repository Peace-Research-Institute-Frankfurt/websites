import React, { useState, useRef } from 'react'
import { Link } from 'gatsby'
import Logo from '../assets/logo.png'
import * as styles from './SiteHeader.module.scss'

export default function SiteHeader({ unit, chapter, bookmarks }) {
  const [bookmarksActive, setBookmarksActive] = useState(false)
  const bookmarksTriggerRef = useRef()
  let bookmarkItems = []
  if (bookmarks) {
    bookmarkItems = bookmarks.map((b) => {
      return (
        <li key={b.slug}>
          <Link to={`../../${b.slug}`}>
            <span className={styles.bookmarkEyebrow}>{b.eyebrow}</span>
            <span className={styles.bookmarkTitle}>{b.title}</span>
          </Link>
        </li>
      )
    })
  }
  function toggleBookmarks() {
    setBookmarksActive((prev) => !prev)
  }
  function showBookmarks() {
    setBookmarksActive(true)
  }
  function hideBookmarks() {
    setBookmarksActive(false)
  }
  return (
    <header className={styles.container}>
      <Link className={styles.logo} to="/">
        <img src={Logo} alt="" />
        EUNPDC E-Learning
      </Link>
      <div className={styles.bookmarks}>
        <button ref={bookmarksTriggerRef} aria-controls="bookmarksOverlay" onClick={toggleBookmarks}>
          Bookmarks
        </button>
        <div className={`${styles.bookmarksContainer} ${bookmarksActive && styles.bookmarksContainerActive}`} id="bookmarksOverlay">
          <ul
            onFocusCapture={showBookmarks}
            onBlurCapture={hideBookmarks}
            className={`${styles.bookmarks} ${bookmarksActive ? styles.bookmarksActive : ''}`}
          >
            {bookmarkItems}
          </ul>
        </div>
      </div>
    </header>
  )
}
