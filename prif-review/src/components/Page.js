import { graphql } from 'gatsby'
import React from 'react'
import App from './App'
import PostBody from './PostBody'
import * as styles from './Page.module.scss'
import Meta from './Meta'

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
      modifiedTime(locale: "de-DE", formatString: "dddd, D.M.YYYY")
      childMdx {
        fields {
          slug
          locale
        }
        frontmatter {
          title
          intro
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
  }
`
const Page = ({ data, children, pageContext }) => {
  const frontmatter = data.post.childMdx.frontmatter
  return (
    <App pages={data.pages.nodes} translations={data.translations.nodes} language={pageContext.language}>
      <article id="content" className={styles.container}>
        <main>
          <h1 className={styles.title}>{frontmatter.title}</h1>
          <PostBody>{children}</PostBody>
        </main>
      </article>
    </App>
  )
}

export function Head({ data, pageContext }) {
  const frontmatter = data.post.childMdx.frontmatter
  return (
    <>
      <html lang={pageContext.language} />
      <Meta title={`${frontmatter.title} – ${data.site.siteMetadata.title}`} description={frontmatter.intro} />
    </>
  )
}

export default Page
