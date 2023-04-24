import { graphql } from 'gatsby'
import React, { useEffect, useRef, useState } from 'react'
import PostBody from './PrintPostBody'
import FundingLogo from '../assets/icons/funded-by-eu.svg'
import * as styles from './LearningUnitPrint.module.scss'
import { Previewer } from 'pagedjs'
import './paged.scss'

export const query = graphql`
  query ($lu_id: String) {
    site: site {
      siteMetadata {
        title
        siteUrl
      }
    }
    post: allFile(filter: { name: { eq: "index" }, sourceInstanceName: { eq: "luContent" }, relativeDirectory: { eq: $lu_id } }) {
      nodes {
        childMdx {
          body
          fields {
            slug
          }
          frontmatter {
            title
            intro
            order
            authors {
              id
              frontmatter {
                name
                author_id
                institution
                image {
                  childImageSharp {
                    gatsbyImageData(width: 250, placeholder: BLURRED)
                  }
                }
              }
              parent {
                ... on Mdx {
                  body
                }
              }
            }
          }
        }
      }
    }
    chapters: allFile(
      filter: {
        extension: { eq: "mdx" }
        name: { nin: ["index", "__print"] }
        sourceInstanceName: { eq: "luContent" }
        relativeDirectory: { eq: $lu_id }
      }
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
  const [timestamp, setTimestamp] = useState('')
  const previewRef = useRef()
  const unit = data.post.nodes[0].childMdx.frontmatter
  useEffect(() => {
    setTimestamp(new Date().toUTCString())
    window.setTimeout(() => {
      let paged = new Previewer()
      paged.preview(containerRef.current.innerHTML, ['/print.css'], previewRef.current).then((flow) => {
        console.log('Rendered', flow.total, 'pages.')
      })
    }, 500)
  }, [])

  return (
    <>
      <div ref={previewRef}></div>
      <div className={styles.container} ref={containerRef}>
        <div className="runningHeaderRight">
          <span>EUNPDC eLearning / {unit.title}</span>
        </div>
        <div className="runningFooter">
          <span className="retrieved">Generated {timestamp}</span>
        </div>
        <header className="cover">
          <section className="coverTitle">
            <span className="coverEyebrow">
              {data.site.siteMetadata.title} / Unit {unit.order}
            </span>
            <h1 className="unitTitle">{unit.title}</h1>
            <p className="unitIntro">{unit.intro}</p>
          </section>
          <section className="coverMeta">
            <ul className="unitAuthors">
              {unit.authors.map((el, i) => {
                return (
                  <li key={`author-${el.id}`} className="coverAuthor">
                    <span className="authorName">{el.frontmatter.name}</span>
                    <span className="authorInstitution">{el.frontmatter.institution}</span>
                  </li>
                )
              })}
            </ul>
            <div className="coverAbout">
              <p>
                The EU Non-Proliferation and Disarmament eLearning Course aims to cover all aspects of the EU non-proliferation and disarmament
                agenda. It's produced by PRIF with financial assistance of the European Union. The contents of individual learning units are the sole
                responsibility of the respective authors and don't necessariy reflect the position of the European Union.
              </p>
            </div>
            <div className="coverFunding">
              <FundingLogo className="fundingLogo" />
            </div>
          </section>
        </header>
        <PostBody unit={data.post.nodes[0]} site={data.site} content={children} />
      </div>
    </>
  )
}
export default LearningUnit
