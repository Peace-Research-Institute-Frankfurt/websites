import React from 'react'
import * as styles from './PostList.module.scss'
import { Link } from 'gatsby'

const PostList = ({ children }) => {
  return <ol className={styles.list}>{children}</ol>
}

const PostListItem = ({ title, category, isCurrent, slug }) => {
  return (
    <Link className={`${styles.item} ${category ? category : ''} ${isCurrent ? styles.current : ''}`} to={`/${slug}`}>
      {title}
    </Link>
  )
}

export { PostListItem, PostList }
