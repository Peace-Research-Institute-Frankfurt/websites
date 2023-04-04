import { graphql } from 'gatsby'
import React from 'react'
import PostBody from './PrintPostBody'

export const query = graphql`
  query ($id: String, $lu_id: String) {
    site: site {
      siteMetadata {
        title
      }
    }
    post: file(id: { eq: $id }) {
      childMdx {
        body
      }
    }
    chapters: allFile(
      filter: { extension: { eq: "mdx" }, name: { ne: "index" }, sourceInstanceName: { eq: "luContent" }, relativeDirectory: { eq: $lu_id } }
      sort: { childMdx: { frontmatter: { order: ASC } } }
    ) {
      nodes {
        id
        name
        relativeDirectory
        childMdx {
          body
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
  }
`

const LearningUnit = ({ data, children }) => {
  return (
    <>
      <div id="preview"></div>
      <article id="content">
        <header>
          <h1>The UN Disarmament Machinery</h1>
        </header>
        <PostBody content={children} />
      </article>
    </>
  )
}

export default LearningUnit
