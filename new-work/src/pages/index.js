import React from 'react'
import { Link, graphql } from 'gatsby'
import { StaticImage } from 'gatsby-plugin-image'
import App from '../components/App'
import Meta from '../components/Meta'
import SkipToContent from '../components/SkipToContent'
import { gri } from '../components/util'
import * as styles from './index.module.scss'
import PostHeader from '../components/PostHeader'

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
            order
            intro
            authors {
              frontmatter {
                name
                author_id
                image {
                  childImageSharp {
                    gatsbyImageData(placeholder: NONE, width: 70, layout: CONSTRAINED)
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`

const Index = ({ data }) => {
  const categories = ['Raum', 'Mensch', 'Tool']

  const posts = data.posts.nodes.map((node, i) => {
    const fm = node.childMdx.frontmatter
    return (
      <li key={`post-${i}`}>
        <Link className={styles.post} to={node.childMdx.fields.slug}>
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
          image={<StaticImage src="../images/monolith-spot.png" alt="" layout="fullWidth" />}
          title="Neue Arbeitsformen für Wissenschaft und Forschung"
          intro="New Work bricht Regeln auf, hinterfragt Machtverhältnisse und rückt den Menschen seinen Stärken, Bedürfnissen und Emotiononen in den Fokus."
          credit="Illustration von Max Köhler"
        />
        <section className={styles.content}>
          <h2 className={styles.sectionTitle}>Inhalte</h2>
          <ol className={styles.filters}>
            {categories.map((el) => {
              return (
                <li>
                  <button className={styles.filter}>{el}</button>
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
