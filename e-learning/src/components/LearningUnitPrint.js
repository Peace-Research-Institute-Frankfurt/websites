import { graphql } from 'gatsby'
import React, { useEffect, useRef } from 'react'
import PostBody from './PrintPostBody'
import { Previewer } from 'pagedjs'
import * as styles from './LearningUnitPrint.module.scss'
import './paged.scss'

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
  const containerRef = useRef()
  const previewRef = useRef()
  const unit = data.post.childMdx.frontmatter
  useEffect(() => {
    let paged = new Previewer()
    paged.preview(containerRef.current.innerHTML, ['/print.css'], previewRef.current).then((flow) => {
      console.log('Rendered', flow.total, 'pages.')
    })
  }, [])

  return (
    <>
      <div ref={previewRef}></div>
      <div className={styles.container} ref={containerRef}>
        <header>
          <h1 className="unitTitle">Unit Title</h1>
          <p className="unitIntro">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Adipisci voluptatum dignissimos illo ipsam porro? Deserunt libero ducimus illum
            atque laudantium error nemo. Voluptatum aut nihil, ullam consectetur rerum ut inventore!
          </p>
        </header>
        <PostBody content={children} />
        <div className="running">
          <span className="title">EUNPDC eLearning</span>
          <span className="date">01. January 1999</span>
        </div>
      </div>
    </>
  )
}
export default LearningUnit
