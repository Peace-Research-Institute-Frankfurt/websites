import React from 'react'
import { graphql } from 'gatsby'
import App from './App'
import PostBody from './PostBody'
import Meta from './Meta'
import * as styles from './Post.module.scss'

export const query = graphql`
  query ($id: String!, $language: String!, $translations: [String!]) {
    site: site {
      siteMetadata {
        title
      }
    }
    locales: allLocale(filter: { language: { eq: $language } }) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
    post: file(id: { eq: $id }) {
      childMdx {
        fields {
          slug
        }
        frontmatter {
          title
          intro
          order
        }
      }
    }
    pages: allFile(filter: { extension: { eq: "mdx" }, sourceInstanceName: { eq: "pages" }, childMdx: { fields: { locale: { eq: $language } } } }) {
      nodes {
        id
        childMdx {
          fields {
            slug
          }
          frontmatter {
            title
            order
          }
        }
      }
    }
    translations: allFile(filter: { id: { in: $translations } }) {
      nodes {
        childMdx {
          fields {
            locale
            slug
          }
          frontmatter {
            title
          }
        }
      }
    }
  }
`
const Post = ({ data, pageContext, children }) => {
  const frontmatter = data.post.childMdx.frontmatter

  return (
    <App translations={data.translations.nodes} pages={data.pages.nodes} language={pageContext.language}>
      <article id="content" className={styles.postContainer}>
        <header className={styles.header}>
          <h1 className={styles.title}>{frontmatter.title}</h1>
          <p className={styles.intro}>{frontmatter.intro}</p>
        </header>
        <PostBody>{children}</PostBody>
      </article>
    </App>
  )
}

export function Head({ data }) {
  const frontmatter = data.post.childMdx.frontmatter
  return <Meta title={`${frontmatter.title} – ${data.site.siteMetadata.title}`} description={frontmatter.intro} />
}

export default Post
