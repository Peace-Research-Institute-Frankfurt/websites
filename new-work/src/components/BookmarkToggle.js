import React from 'react'
import HeartFilled from '../images/heart-filled.svg'
import HeartOutline from '../images/heart-stroke.svg'
import * as styles from './BookmarkToggle.module.scss'

export default function BookmarkToggle({ post, className, bookmarks, setBookmarks }) {
  const bookmarkIndex = bookmarks.findIndex((el) => {
    return el.slug === post.childMdx.fields.slug
  })

  function toggleBookmark() {
    setBookmarks((prevBookmarks) => {
      if (bookmarkIndex === -1) {
        console.log(post)
        const newBookmark = {
          slug: post.childMdx.fields.slug,
        }
        return [...prevBookmarks, newBookmark]
      } else {
        return prevBookmarks.filter((el) => {
          return el.slug !== post.childMdx.fields.slug
        })
      }
    })
  }

  return (
    <button onClick={toggleBookmark} className={`${styles.container} ${className ? className : ''}`}>
      {bookmarkIndex === -1 ? <HeartOutline /> : <HeartFilled />}
      {bookmarkIndex === -1 ? 'Als Favorit speichern' : 'Favorit löschen'}
    </button>
  )
}
