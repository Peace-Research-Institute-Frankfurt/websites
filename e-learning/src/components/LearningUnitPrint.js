import React, { useEffect, useRef } from 'react'
import { graphql } from 'gatsby'
import PostBody from './PrintPostBody'
import { Previewer } from 'pagedjs'
import * as styles from './Print.module.scss'

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
  const contentRef = useRef(null)
  useEffect(() => {
    console.log('Running pagedjs')
    let paged = new Previewer()
    let flow = paged.preview(contentRef.current || <div></div>, [], document.querySelector('#preview')).then((flow) => {
      console.log('Rendered', flow.total, 'pages.')
    })
  }, [contentRef])
  return (
    <>
      <div id="preview"></div>
      <article id="content" ref={contentRef}>
        <header>
          <h1>The UN Disarmament Machinery</h1>
        </header>
        <PostBody content={children} />
      </article>
    </>
  )
}

export default LearningUnit
