import React, { useState } from 'react'
import { graphql } from 'gatsby'
import Meta from '../components/Meta'
import App from '../components/App'
import StickyHeader from '../components/StickyHeader'
import SkipToContent from '../components/SkipToContent'
import PostHeader from '../components/PostHeader'
import * as styles from './index.module.scss'
import { PostList, PostListItem } from '../components/PostList'

export const query = graphql`
  query {
    posts: allFile(filter: { extension: { eq: "mdx" }, sourceInstanceName: { eq: "posts" } }, sort: { childMdx: { frontmatter: { order: ASC } } }) {
      nodes {
        id
        childMdx {
          fields {
            slug
          }
          frontmatter {
            title
            category
          }
        }
      }
    }
  }
`

const Index = ({ data }) => {
  const categories = []

  data.posts.nodes.forEach((node) => {
    const category = node.childMdx.frontmatter.category
    if (category && category !== 'meta' && !categories.includes(category)) {
      categories.push(category)
    }
  })
  const [activeFilters, setActiveFilters] = useState(['meta', ...categories])

  const posts = data.posts.nodes
    .filter((node) => {
      return activeFilters.includes(node.childMdx.frontmatter.category)
    })
    .map((node) => {
      const fm = node.childMdx.frontmatter
      return (
        <li key={`post-${node.id}`}>
          <PostListItem title={fm.title} category={fm.category} slug={node.childMdx.fields.slug} />
        </li>
      )
    })
  return (
    <App>
      <SkipToContent />
      <StickyHeader />
      <main id="content" className={styles.container}>
        <PostHeader
          video={
            <iframe
              src="https://player.vimeo.com/video/867440111?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479&background=1"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              title="1_storyboard-rooms-animated"
            ></iframe>
          }
          title="Neue Arbeitsformen für die Wissenschaft"
          intro={
            <>
              New Work bricht Regeln auf, hinterfragt Machtverhältnisse und rückt den Menschen seinen Stärken, Bedürfnissen und Emotiononen in den
              Fokus. Diese Handreichung sammelt Anleitungen und Ressourcen zu <span className={styles.introSpace}>Raum</span>,{' '}
              <span className={styles.introPeople}>Mensch</span> und <span className={styles.introTools}>Tools</span>, die den Übergang zur New Work
              in wissenschaftlichen Einrichtungen zu begleiten.
            </>
          }
          credit="[Verena Mack](https://verenamack.com/)"
        />
        <section className={styles.content}>
          <ol className={styles.filters}>
            {categories.map((category) => {
              return (
                <li key={`category.${category}`}>
                  <button
                    onClick={() => {
                      if (activeFilters.includes(category)) {
                        setActiveFilters((prev) => {
                          return prev.filter((el) => el !== category)
                        })
                      } else {
                        setActiveFilters((prev) => {
                          return [...prev, category]
                        })
                      }
                    }}
                    className={`${styles.filter} ${category} ${activeFilters.includes(category) && styles.activeFilter}`}
                  >
                    {category}
                  </button>
                </li>
              )
            })}
          </ol>
          <PostList>{posts}</PostList>
        </section>
      </main>
    </App>
  )
}

export default Index
export const Head = ({ data }) => <Meta />
