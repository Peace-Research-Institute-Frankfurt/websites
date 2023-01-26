import React, { useState } from 'react'
import { Link } from 'gatsby'
import Logo from '../assets/logo.png'
import Tooltip from './Tooltip'
import * as styles from './SiteHeader.module.scss'

export default function SiteHeader({ unit, chapter, bookmarks }) {
  const [bookmarksActive, setBookmarksActive] = useState(false)
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
      <div className={styles.tools}>
        <div className={styles.bookmarksContainer}>
          <button aria-controls="bookmarksOverlay" className={styles.bookmarksToggle} onClick={toggleBookmarks}>
            Bookmarks
          </button>
          <Tooltip id="bookmarksOverlay" position="bottom-left" arrow="top-right" active={bookmarksActive}>
            <ul
              onFocusCapture={showBookmarks}
              onBlurCapture={hideBookmarks}
              className={`${styles.bookmarks} ${bookmarksActive ? styles.bookmarksActive : ''}`}
            >
              {bookmarkItems}
            </ul>
          </Tooltip>
        </div>
      </div>
    </header>
  )
}
