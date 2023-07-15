import React, { useState } from 'react'
import { Link, graphql } from 'gatsby'
import { StaticImage } from 'gatsby-plugin-image'
import App from '../components/App'
import Meta from '../components/Meta'
import SkipToContent from '../components/SkipToContent'
import PostHeader from '../components/PostHeader'
import * as styles from './index.module.scss'

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
    if (category && !categories.includes(category)) {
      categories.push(category)
    }
  })
  const [activeFilters, setActiveFilters] = useState(categories)

  const posts = data.posts.nodes
    .filter((node) => {
      return activeFilters.includes(node.childMdx.frontmatter.category)
    })
    .map((node, i) => {
      const fm = node.childMdx.frontmatter
      return (
        <li key={`post-${i}`}>
          <Link className={`${styles.post} ${fm.category ? fm.category : ''}`} to={node.childMdx.fields.slug}>
            {fm.title}
          </Link>
        </li>
      )
    })
  return (
    <App>
      <SkipToContent />
      <main id="content" className={styles.container}>
        <PostHeader
          image={<StaticImage src="../images/cubes.png" alt="" layout="fullWidth" />}
          title="Neue Arbeitsformen für Wissenschaft und Forschung"
          intro="New Work bricht Regeln auf, hinterfragt Machtverhältnisse und rückt den Menschen seinen Stärken, Bedürfnissen und Emotiononen in den Fokus."
          credit="Illustration von Max Köhler"
        />
        <section className={styles.content}>
          <h2 className={styles.sectionTitle}>Inhalte</h2>
          <ol className={styles.filters}>
            {categories.map((category) => {
              return (
                <li>
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
          <ol className={styles.posts}>{posts}</ol>
        </section>
      </main>
    </App>
  )
}

export default Index
export const Head = ({ data }) => <Meta />
