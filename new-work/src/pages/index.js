import React, { useState } from 'react'
import { graphql } from 'gatsby'
import Meta from '../components/Meta'
import App from '../components/App'
import StickyHeader from '../components/StickyHeader'
import SkipToContent from '../components/SkipToContent'
import PostHeader from '../components/PostHeader'
import { PostList } from '../components/PostList'
import EventBanner from '../components/EventBanner'
import SearchForm from '../components/SearchForm'
import Schedule from '../components/Schedule'
import * as styles from './index.module.scss'

export const query = graphql`
  query {
    posts: allFile(
      filter: { extension: { eq: "mdx" }, sourceInstanceName: { eq: "posts" } }
      sort: { childMdx: { frontmatter: { order: ASC } } }
    ) {
      nodes {
        id
        childMdx {
          fields {
            slug
          }
          frontmatter {
            title
            short_title
            title_prefix
            intro
            category
            published_on
            format
            order
            authors {
              frontmatter {
                name
              }
            }
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

  const heroVideo = (
    <div className={styles.heroVideo}>
      <video
        autoPlay
        muted
        loop
        playsInline
        title="Neue Arbeitsformen in der Wissenschaft"
      >
        <source src="/videos/homepage_splash_video (1080p).mp4" type="video/mp4" />
      </video>
    </div>
  )

  return (
    <App>
      <SkipToContent />
      <StickyHeader searchForm={<SearchForm />} />
      <main id="content" className={styles.container}>
        <PostHeader
          media={heroVideo}
          hasIllustration={true}
          title="Neue Arbeitsformen für die Wissenschaft"
          intro={
            <>
              Vor dem Hintergrund der Digitalisierung revolutioniert New Work herkömmliche Strukturen, stellt tradierte
              Arbeitsweisen infrage und stärkt die Bedeutung des Menschen mit seinen Kompetenzen, Talenten, Wünschen und
              Emotionen. Die Leibniz-Gemeinschaft bietet mit WorkNew@leibniz zahlreiche Interviews, Texte und Tipps und
              unterstützt so ihre Forschungsinstitute auf dem Weg zu neuen Räumen und Arbeitsformen.
            </>
          }
          credits={[{ name: '[Verena Mack](https://verenamack.com/)' }]}
        />
        <Schedule from="2024-05-30" to="2024-09-27">
          <EventBanner />
        </Schedule>
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
          <PostList posts={data.posts.nodes} activeFilters={activeFilters} />
        </section>
      </main>
    </App>
  )
}

export default Index
export const Head = ({ data }) => <Meta />