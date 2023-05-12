import React from 'react'
import { graphql } from 'gatsby'
import App from './App'
import PostBody from './PostBody'
import SkipToContent from './SkipToContent'
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
const Post = ({ data, children }) => {
  const frontmatter = data.post.childMdx.frontmatter

  return (
    <App translations={data.translations.nodes} pages={data.pages.nodes}>
      <SkipToContent />
      <article id="content">
        <main>
          <h1>{frontmatter.title}</h1>
          <p>Translations: {data.translations.nodes.map((node) => node.childMdx.frontmatter.title).join(', ')}</p>
          {frontmatter.intro}
          <PostBody>{children}</PostBody>
        </main>
      </article>
    </App>
  )
}

export function Head({ data }) {
  const frontmatter = data.post.childMdx.frontmatter
  return <Meta title={`${frontmatter.title} – ${data.site.siteMetadata.title}`} description={frontmatter.intro} />
}

export default Post
