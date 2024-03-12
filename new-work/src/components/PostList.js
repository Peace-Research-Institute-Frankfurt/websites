import React, { useState } from 'react'
import * as styles from './PostList.module.scss'
import { Link } from 'gatsby'
import Button from './ButtonAdapter'
import ButtonGroup from './ButtonGroup'
import PlaceholderText from './PlaceholderText'
import GridIcon from '../images/grid.svg'
import ListIcon from '../images/list.svg'

const PostList = ({ posts, activeFilters, currentPostId }) => {
  const [showList, setShowList] = useState(false)
  const postGroups = [
    'none',
    ...posts
      .map((node) => {
        return node.childMdx.frontmatter.format
      })
      .filter((el, i, arr) => {
        return el && arr.indexOf(el) === i
      }),
  ]

  const categories = ['meta', 'raum', 'tool', 'mensch']

  const groupedPosts = []
  postGroups.forEach((group) => {
    const newGroup = { name: group, posts: [] }
    posts.forEach((node) => {
      const format = node.childMdx.frontmatter.format || 'none'
      if (format === group) {
        newGroup.posts.push(node)
      }
    })
    groupedPosts.push(newGroup)
  })

  const postEls = groupedPosts.map((group) => {
    const postEls = group.posts
      .filter((node) => {
        return activeFilters ? activeFilters.includes(node.childMdx.frontmatter.category) : true
      })
      .sort((a, b) => {
        return categories.indexOf(a.childMdx.frontmatter.category) - categories.indexOf(b.childMdx.frontmatter.category)
      })
      .map((node) => {
        const fm = node.childMdx.frontmatter
        return (
          <li key={`post-${node.id}`}>
            <PostListItem
              title={fm.short_title || fm.title}
              category={fm.category}
              slug={node.childMdx.fields.slug}
              intro={fm.intro}
              isCurrent={currentPostId && currentPostId === node.id}
              format={node.childMdx.frontmatter.format}
            />
          </li>
        )
      })
    return (
      <React.Fragment key={`group-${group.name}`}>
        {group.name !== 'none' && <PostGroupLabel label={group.name} />}
        {postEls}
      </React.Fragment>
    )
  })

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
      <ol className={`${styles.list}`}>{postEls}</ol>
    </section>
  )
}

const PostListItem = ({ title, intro, format, category, isCurrent, slug }) => {
  const maxWordCount = 35
  let truncatedIntro = ''
  if (intro) {
    truncatedIntro = intro.split(' ').length > maxWordCount ? intro.split(' ').slice(0, maxWordCount).join(' ') + '...' : intro
  }
  return (
    <Link
      className={`${styles.item} ${category === 'meta' ? styles.meta : ''} ${category ? category : ''} ${isCurrent ? styles.current : ''}`}
      to={`/${slug}`}
    >
      <div>
        {format && format !== '' && <span className={styles.format}>{format}</span>}
        <span className={styles.title}>{title}</span>
      </div>
      {intro ? <p className={styles.intro}>{truncatedIntro}</p> : <PlaceholderText className={styles.intro} />}
    </Link>
  )
}

const PostGroupLabel = ({ label }) => {
  return <h3 className={styles.groupLabel}>{label}</h3>
}

export { PostListItem, PostGroupLabel, PostList }
