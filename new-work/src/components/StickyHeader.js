import { Link, graphql, useStaticQuery } from 'gatsby'
import { StaticImage } from 'gatsby-plugin-image'
import React, { useEffect, useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import useScrollPosition from '../hooks/useScrollPosition'
import LeftArrow from '../images/arrow-left.svg'
import RightArrow from '../images/arrow-right.svg'
import BookmarkToggle from './BookmarkToggle.js'
import BookmarksList from './BookmarksList'
import Button from './Button'
import ButtonGroup from './ButtonGroup'
import * as styles from './StickyHeader.module.scss'

export default function StickyHeader({ title, next, prev, post }) {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)
  const [bookmarks, setBookmarks] = useLocalStorage('bookmarks', [])
  const [faves, setFaves] = useState([])
  const [bookmarksActive, setBookmarksActive] = useState(false)
  const scrollPosition = useScrollPosition()
  const isScrolled = scrollPosition.y > 50
  let scrollProgress = 0
  if (typeof window !== 'undefined') {
    scrollProgress = Math.min(1, scrollPosition.y / (document.body.scrollHeight - window.innerHeight))
  }
  const containerStyles = {
    '--scroll': scrollPosition.y,
    '--progress': scrollProgress,
  }
  useEffect(() => {
    setFaves(bookmarks)
  }, [bookmarks])
  return (
    <>
      <header style={containerStyles} className={`${styles.container} ${isScrolled && styles.stuck}`}>
        <div className={styles.copy}>
          <div className={styles.left}>
            <Link className={styles.logo} to="/">
              <StaticImage
                imgStyle={{ objectFit: 'contain' }}
                placeholder="none"
                width={70}
                layout="constrained"
                className={styles.face}
                src="../images/leibniz-head.png"
                alt="New Work Logo"
              />
            </Link>
            <span className={styles.title}>{title}</span>
          </div>
          <Link to="/" className={styles.siteTitle}>
            {data.site.siteMetadata.title}
          </Link>
          <section>
            <ButtonGroup>
              <nav className={styles.pagination}>
                {prev && (
                  <Link to={`/${prev.childMdx.fields.slug}`}>
                    Vorheriger Artikel
                    <LeftArrow />
                  </Link>
                )}
                {next && (
                  <Link to={`/${next.childMdx.fields.slug}`}>
                    Nächster Artikel
                    <RightArrow />
                  </Link>
                )}
              </nav>
              <BookmarkToggle post={post} bookmarks={faves} setBookmarks={setBookmarks} />
              <Button label="Favoriten" onClick={() => setBookmarksActive(!bookmarksActive)} />
            </ButtonGroup>
            <div className={`${styles.bookmarksContainer} ${bookmarksActive && styles.bookmarksContainerActive}`}>
              <div className={styles.bookmarksContainerInner}>
                <BookmarksList bookmarks={faves} setBookmarks={setBookmarks} />
              </div>
            </div>
          </section>
        </div>
        <div className={styles.progress}>
          <div className={styles.progressInner}></div>
        </div>
      </header>
      <button className={`${styles.backdrop} ${bookmarksActive && styles.backdropActive}`} onClick={() => setBookmarksActive(false)}>
        Close Bookmarks
      </button>
    </>
  )
}
