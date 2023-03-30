import { Link } from 'gatsby'
import React, { useState, useEffect } from 'react'
import useScrollPosition from '@shared/hooks/useScrollPosition'
import useLocalStorage from '@shared/hooks/useLocalStorage'

import Button, { ButtonGroup } from './ButtonAdapter'
import BookmarksList from './BookmarksList'
import UnitChip from './UnitChip'
import BookIcon from '../assets/icons/favicon.svg'
import ArrowLeft from '../assets/icons/arrow-left.svg'
import ArrowRight from '../assets/icons/arrow-right.svg'
import BookmarkOutline from '../assets/icons/bookmark-add.svg'
import BookmarkFilled from '../assets/icons/bookmark-added.svg'
import Popover from './Popover'

import * as styles from './StickyHeader.module.scss'

export default function StickyHeader({ post, unit, next, chapters, prev }) {
  const scrollPosition = useScrollPosition()
  const [bookmarksActive, setBookmarksActive] = useState(false)
  const [chaptersActive, setChaptersActive] = useState(false)
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

  let unitChip = <></>
  if (unit && post) {
    unitChip = (
      <Link to={`../`} className={styles.unit}>
        <UnitChip>Unit {unit.childMdx.frontmatter.order}</UnitChip>
      </Link>
    )
  } else if (unit) {
    unitChip = <UnitChip>Unit {unit.childMdx.frontmatter.order}</UnitChip>
  }

  return (
    <>
      <header className={`${styles.container} ${isScrolled ? styles.containerActive : ''} ${post ? styles.hasPost : ''}`}>
        {process.env.NODE_ENV === 'development' ? (
          <Link className={styles.home} to="/">
            <BookIcon />
            <span className={styles.homeLabel}>EUNPDC eLearning</span>
          </Link>
        ) : (
          <span className={styles.home}>
            <BookIcon />
          </span>
        )}
        <div className={styles.statusLocation}>
          {unitChip}
          <span className={styles.locationLabel}>
            {unit && <span className={styles.unitName}>{unit.childMdx.frontmatter.title}</span>}
            {post && (
              <span className={styles.post}>
                Chapter {post.childMdx.frontmatter.order}: {post.childMdx.frontmatter.title}
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

          {chapters && (
            <Popover
              isActive={chaptersActive}
              setIsActive={setChaptersActive}
              title={<Link to="../">All chapters</Link>}
              trigger={
                <Button
                  state={chaptersActive ? 'active' : 'default'}
                  priority="secondary"
                  label="Chapters"
                  onClick={() => {
                    setChaptersActive(!chaptersActive)
                  }}
                />
              }
            >
              <ol>
                {chapters.map((c, i) => {
                  const bookmarkIndex = bookmarks.findIndex((el) => {
                    return el.id === c.id
                  })
                  return (
                    <li className={styles.chaptersItem} key={`chapters-${i}`}>
                      <Link className={styles.chaptersLink} to={`${unit.childMdx.fields.slug}${c.childMdx.fields.slug}`}>
                        {c.childMdx.frontmatter.order + 1}. {c.childMdx.frontmatter.title}
                        {bookmarkIndex !== -1 && (
                          <span className={styles.chaptersBookmarked}>
                            <BookmarkFilled />
                          </span>
                        )}
                      </Link>
                    </li>
                  )
                })}
              </ol>
            </Popover>
          )}

          <ButtonGroup>
            {post && (
              <Button
                priority="secondary"
                label={bookmarkIndex === -1 ? 'Add bookmark' : 'Remove bookmark'}
                hideLabel={true}
                onClick={() => {
                  toggleBookmark()
                }}
                icon={bookmarkIndex === -1 ? <BookmarkOutline /> : <BookmarkFilled />}
              ></Button>
            )}
            <Popover
              isActive={bookmarksActive}
              setIsActive={setBookmarksActive}
              title="Your bookmarks"
              trigger={
                <Button
                  label="Bookmarks"
                  priority="secondary"
                  state={bookmarksActive ? 'active' : 'default'}
                  className="toggleBookmarks"
                  onClick={() => {
                    setBookmarksActive(!bookmarksActive)
                  }}
                />
              }
            >
              <BookmarksList bookmarks={faves} setBookmarks={setBookmarks} />
            </Popover>
          </ButtonGroup>
        </div>
      </header>
    </>
  )
}
