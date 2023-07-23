import React from 'react'
import { graphql } from 'gatsby'
import App from '../components/App'
import Meta from '../components/Meta'
import SkipToContent from '../components/SkipToContent'
import { Link } from 'gatsby-plugin-react-i18next'
import * as styles from './Report.module.scss'

export const query = graphql`
  query ($id: String!, $language: String!, $postsDirectory: String!) {
    locales: allLocale(filter: { language: { eq: $language } }) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }

    site {
      siteMetadata {
        title
        siteUrl
      }
    }

    post: file(id: { eq: $id }) {
      relativeDirectory
      childMdx {
        fields {
          slug
        }
        frontmatter {
          title
          intro
          order
          authors {
            frontmatter {
              author_id
            }
          }
        }
      }
    }

    posts: allFile(
      filter: {
        extension: { eq: "mdx" }
        relativeDirectory: { eq: $postsDirectory }
        sourceInstanceName: { eq: "content" }
        childMdx: { fields: { locale: { eq: $language } } }
      }
    ) {
      nodes {
        relativePath
        relativeDirectory
        id
        childMdx {
          fields {
            slug
            locale
          }
          frontmatter {
            title
            order
          }
        }
      }
    }

    pages: allFile(
      filter: {
        relativeDirectory: { glob: "**/pages/**" }
        extension: { eq: "mdx" }
        sourceInstanceName: { eq: "content" }
        childMdx: { fields: { locale: { eq: $language } } }
      }
    ) {
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

const Index = ({ data, pageContext, children, location }) => {
  const year = data.post.relativeDirectory.replace(/(.{2})\/(reports)\//g, '')
  const posts = data.posts.nodes.map((p) => {
    return (
      <li key={p.id}>
        <Link to={`/${year}/${p.childMdx.fields.slug}`}>{p.childMdx.frontmatter.title}</Link>
      </li>
    )
  })
  return (
    <App pages={data.pages.nodes} translationData={{ currentLanguage: pageContext.language, currentSlug: location.pathname }}>
      <SkipToContent />
      <main className={styles.container}>
        <h1>{data.post.childMdx.frontmatter.title}</h1>
        {children}
        <ol>{posts}</ol>
      </main>
    </App>
  )
}

export default Index
export const Head = ({ data, pageContext, location }) => {
  const frontmatter = data.post.childMdx.frontmatter
  const translationData = { currentLanguage: pageContext.language, currentSlug: location.pathname }
  return <Meta title={`${frontmatter.title} – ${data.site.siteMetadata.title}`} translationData={translationData} />
}
