import React from 'react'
import { graphql } from 'gatsby'
import App from './App'
import PostBody from './PostBody'
import SkipToContent from './SkipToContent'
import Meta from './Meta'

export const query = graphql`
  query ($id: String!) {
    site: site {
      siteMetadata {
        title
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
  }
`
const Post = ({ data, children }) => {
  const frontmatter = data.post.childMdx.frontmatter

  return (
    <App>
      <SkipToContent />
      <article id="content">
        <main>
          <h1>{frontmatter.title}</h1>
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
