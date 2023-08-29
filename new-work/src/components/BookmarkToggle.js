import React from 'react'
import HeartFilled from '../images/heart-filled.svg'
import HeartOutline from '../images/heart-stroke.svg'
import Button from './ButtonAdapter.js'

export default function BookmarkToggle({ post, bookmarks, setBookmarks }) {
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
    <Button
      label={bookmarkIndex === -1 ? 'Als Favorit speichern' : 'Favorit löschen'}
      type="icon"
      priority="secondary"
      hideLabel={true}
      onClick={toggleBookmark}
      icon={bookmarkIndex === -1 ? <HeartOutline /> : <HeartFilled />}
    />
  )
}
