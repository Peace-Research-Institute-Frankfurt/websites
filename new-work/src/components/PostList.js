import React, { useState } from 'react'
import * as styles from './PostList.module.scss'
import { Link } from 'gatsby'
import Button from './ButtonAdapter'
import ButtonGroup from './ButtonGroup'
import GridIcon from '../images/grid.svg'
import ListIcon from '../images/list.svg'

const PostList = ({ children }) => {
  const [showList, setShowList] = useState(false)
  return (
    <section className={`${styles.container} ${showList ? styles.showList : styles.showBubbles}`}>
      <div className={styles.controls}>
        <ButtonGroup>
          <Button
            onClick={() => {
              setShowList(false)
            }}
            priority={showList ? 'secondary' : 'primary'}
            size="medium"
            icon={<GridIcon />}
            label="Bubbles"
            hideLabel={true}
          />
          <Button
            onClick={() => {
              setShowList(true)
            }}
            priority={showList ? 'primary' : 'secondary'}
            icon={<ListIcon />}
            hideLabel={true}
            size="medium"
            label="List"
          />
        </ButtonGroup>
      </div>
      <ol className={`${styles.list}`}>{children}</ol>
    </section>
  )
}

const PostListItem = ({ title, intro, category, isCurrent, slug }) => {
  const maxWordCount = 25
  let truncatedIntro = ''
  if (intro) {
    truncatedIntro = intro.split(' ').length > maxWordCount ? intro.split(' ').slice(0, maxWordCount).join(' ') + '...' : intro
  }
  return (
    <Link
      className={`${styles.item} ${category === 'meta' ? styles.meta : ''} ${category ? category : ''} ${isCurrent ? styles.current : ''}`}
      to={`/${slug}`}
    >
      <span className={styles.title}>{title}</span>
      {intro && <p className={styles.intro}>{truncatedIntro}</p>}
    </Link>
  )
}

export { PostListItem, PostList }
