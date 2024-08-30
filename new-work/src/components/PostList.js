import React, { useState } from 'react'
import * as styles from './PostList.module.scss'
import { Link, useStaticQuery, graphql } from 'gatsby'
import Button from './ButtonAdapter'
import ButtonGroup from './ButtonGroup'
import PlaceholderText from './PlaceholderText'
import GridIcon from '../images/grid.svg'
import ListIcon from '../images/list.svg'
import ArrowRightIcon from '../images/arrow-right.svg'

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
        return a.childMdx.frontmatter.order - b.childMdx.frontmatter.order
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
              authors={fm.authors}
              prefix={fm.title_prefix}
              publishedOn={fm.published_on}
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

const PostListItem = ({ title, authors, intro, prefix, category, isCurrent, publishedOn, slug }) => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          devFlags {
            key
            value
          }
        }
      }
    }
  `)
  const maxWordCount = 35
  let truncatedIntro = ''
  let publishedOnDate = null

  const disablePostScheduling =
    data.site.siteMetadata.devFlags.find((el) => {
      return el.key === 'DISABLE_POST_SCHEDULING'
    }).value === 'true'

  if (intro) {
    truncatedIntro = intro.split(' ').length > maxWordCount ? intro.split(' ').slice(0, maxWordCount).join(' ') + '...' : intro
  }
  if (publishedOn) {
    publishedOnDate = new Date(publishedOn)
  }

  const isPending = publishedOnDate && publishedOnDate > Date.now()

  return (
    <Link
      className={`${styles.item} ${category ? category : ''} ${isPending && !disablePostScheduling ? styles.isPending : ''} ${
        isCurrent ? styles.current : ''
      }`}
      to={`/${slug}`}
    >
      {isPending && (
        <span className={styles.publishedDate}>
          <span>
            <ArrowRightIcon />
            {publishedOnDate.toLocaleDateString('de-DE')}
          </span>
        </span>
      )}
      <span className={`${styles.title} ${prefix ? styles.hasPrefix : ''}`}>
        {prefix && <span className={styles.titlePrefix}>{prefix}</span>}
        {title}
      </span>
      {!isPending && (
        <div className={styles.intro}>
          {intro ? <p>{truncatedIntro}</p> : <PlaceholderText />}
          {authors && (
            <p className={styles.authors}>
              {authors.map((el, i) => {
                return (
                  <React.Fragment key={`${title}.author.${i}`}>
                    <span>{el.frontmatter.name}</span>
                    {i < authors.length - 1 && ', '}
                  </React.Fragment>
                )
              })}
            </p>
          )}
        </div>
      )}
    </Link>
  )
}

const PostGroupLabel = ({ label }) => {
  return <h3 className={styles.groupLabel}>{label}</h3>
}

export { PostListItem, PostGroupLabel, PostList }
