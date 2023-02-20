import { Link } from 'gatsby'
import React, { useState, useEffect } from 'react'
import useScrollPosition from '@shared/hooks/useScrollPosition'
import useLocalStorage from '@shared/hooks/useLocalStorage'

import Button from './ButtonAdapter'
import BookmarksList from './BookmarksList'
import UnitChip from './UnitChip'
import BookIcon from '../assets/icons/favicon.svg'
import ArrowLeft from '../assets/icons/arrow-left.svg'
import ArrowRight from '../assets/icons/arrow-right.svg'
import BookmarkOutline from '../assets/icons/bookmark-add.svg'
import BookmarkFilled from '../assets/icons/bookmark-added.svg'
import CloseIcon from '../assets/icons/close.svg'

import * as styles from './StickyHeader.module.scss'

export default function StickyHeader({ post, unit, next, prev }) {
  const scrollPosition = useScrollPosition()
  const [bookmarksActive, setBookmarksActive] = useState(false)
  const [bookmarks, setBookmarks] = useLocalStorage('elearning-bookmarks', [])
  const [faves, setFaves] = useState([])

  let scrollProgress = 0
  let isScrolled = false

  if (typeof window !== 'undefined') {
    scrollProgress = scrollPosition.y / (document.body.scrollHeight - window.innerHeight)
    isScrolled = scrollPosition.y > 25
  }

  useEffect(() => {
    setFaves(bookmarks)
  }, [bookmarks])

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
    <>
      <header className={`${styles.container} ${isScrolled ? styles.containerActive : ''}`}>
        <Link className={styles.home} to="/">
          <BookIcon />
          <span className={styles.homeLabel}>EUNPDC eLearning</span>
        </Link>
        <div className={styles.statusLocation}>
          {unit && (
            <Link to={`../`} className={styles.unit}>
              <UnitChip>Unit {unit.childMdx.frontmatter.order}</UnitChip>
            </Link>
          )}
          <span className={styles.locationLabel}>
            {unit && <span className={styles.unitName}>{unit.childMdx.frontmatter.title}</span>}
            {post && (
              <span className={styles.post}>
                {post.childMdx.frontmatter.order}. {post.childMdx.frontmatter.title}
              </span>
            )}
          </span>
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
      </header>
      <div className={`${styles.bookmarksContainer} ${bookmarksActive ? styles.bookmarksContainerActive : null}`}>
        <header className={styles.bookmarksHeader}>
          <span className={styles.bookmarksTitle}>Your bookmarks</span>
          <Button onClick={() => setBookmarksActive(false)} label="Close" priority="ghost" icon={<CloseIcon />} size="small" hideLabel={true} />
        </header>
        <BookmarksList bookmarks={faves} setBookmarks={setBookmarks} />
      </div>
      <button className={`${styles.backdrop} ${bookmarksActive && styles.backdropActive}`} onClick={() => setBookmarksActive(false)}>
        Close Bookmarks
      </button>
    </>
  )
}
