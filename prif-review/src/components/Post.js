import React from 'react'
import { graphql } from 'gatsby'
import { GatsbyImage, getImage, getSrc } from 'gatsby-plugin-image'
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
          }
        }
      }
    }
  }
`
const Post = ({ data, children }) => {
  const frontmatter = data.post.childMdx.frontmatter
  const currentIndex = data.posts.nodes.findIndex((el) => {
    return el.childMdx.frontmatter.order === frontmatter.order
  })

  const next = data.posts.nodes[currentIndex + 1]
  const previous = data.posts.nodes[currentIndex - 1]

  return (
    <App>
      <SkipToContent />
      <article id="content">
        <main>
          <h1>{frontmatter.title}</h1>
          <PostBody>{children}</PostBody>
        </main>
      </article>
    </App>
  )
}

export function Head({ data }) {
  const frontmatter = data.post.childMdx.frontmatter
  return (
    <Meta
      title={`${frontmatter.title} – ${data.site.siteMetadata.title}`}
      description={frontmatter.intro}
    />
  )
}

export default Post
