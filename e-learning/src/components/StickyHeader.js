import { Link } from 'gatsby'
import React, { useState } from 'react'
import useScrollPosition from '../../../shared/hooks/useScrollPosition'

import Button from './ButtonAdapter'
import BookmarksList from './BookmarksList'
import BookIcon from '../assets/icons/favicon.svg'
import ArrowLeft from '../assets/icons/arrow-left.svg'
import ArrowRight from '../assets/icons/arrow-right.svg'
import BookmarkOutline from '../assets/icons/bookmark-add.svg'
import BookmarkFilled from '../assets/icons/bookmark-added.svg'

import * as styles from './StickyHeader.module.scss'

export default function StickyHeader({ post, unit, next, prev, bookmarks, setBookmarks }) {
  const scrollPosition = useScrollPosition()
  const [bookmarksActive, setBookmarksActive] = useState(false)

  let scrollProgress = 0
  if (typeof window !== 'undefined') {
    scrollProgress = scrollPosition.y / (document.body.scrollHeight - window.innerHeight)
  }

  const showStatusClass = scrollPosition.y > 10 ? styles.statusActive : ''
  let bookmarkIndex = 0
  if (post) {
    bookmarkIndex = bookmarks.findIndex((el) => {
      return el.id === post.id
    })
  }
  function toggleBookmark() {
    setBookmarks((prevBookmarks) => {
      if (bookmarkIndex === -1) {
        const bookmark = {
          id: post.id,
        }
        return [...prevBookmarks, bookmark]
      } else {
        return prevBookmarks.filter((el) => {
          return el.id !== post.id
        })
      }
    })
  }
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
          {prev && (
            <Link className={styles.paginationLink} to={`../${prev.childMdx.fields.slug}`}>
              Previous Chapter
              <ArrowLeft />
            </Link>
          )}
          {next && (
            <Link className={styles.paginationLink} to={`../${next.childMdx.fields.slug}`}>
              Next Chapter
              <ArrowRight />
            </Link>
          )}
        </nav>
        {post && (
          <Button
            priority="secondary"
            label={bookmarkIndex === -1 ? 'Add bookmark' : 'Remove bookmark'}
            hideLabel={true}
            onClick={toggleBookmark}
            icon={bookmarkIndex === -1 ? <BookmarkOutline /> : <BookmarkFilled />}
          ></Button>
        )}
        <Button
          label="Bookmarks"
          priority="secondary"
          onClick={() => {
            setBookmarksActive(!bookmarksActive)
          }}
          className="toggleBookmarks"
        />
      </div>
      <div className={`${styles.bookmarksContainer} ${bookmarksActive ? styles.bookmarksContainerActive : null}`}>
        <BookmarksList bookmarks={bookmarks} setBookmarks={setBookmarks} />
      </div>
    </header>
  )
}
