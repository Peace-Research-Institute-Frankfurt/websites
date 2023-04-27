import { graphql } from 'gatsby'
import React, { useEffect, useRef, useState } from 'react'
import PostBody from './PrintPostBody'
import FundingLogo from '../assets/icons/funded-by-eu.svg'
import * as styles from './LearningUnitPrint.module.scss'
import { Previewer } from 'pagedjs'
import './paged.scss'

export const query = graphql`
  query ($lu_id: String, $id: String) {
    site: site {
      siteMetadata {
        title
        siteUrl
      }
    }
    post: file(id: { eq: $id }) {
      id
    }
    posts: allFile(filter: { name: { eq: "index" }, sourceInstanceName: { eq: "luContent" }, relativeDirectory: { eq: $lu_id } }) {
      nodes {
        childMdx {
          body
          tableOfContents
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
  }
`

const LearningUnit = ({ data, children }) => {
  const containerRef = useRef(null)

  const [timestamp, setTimestamp] = useState('')
  const [chapterList, setChapterList] = useState([])
  const previewRef = useRef()
  const unit = data.posts.nodes[0].childMdx.frontmatter
  useEffect(() => {
    setTimestamp(new Date().toUTCString())
    window.setTimeout(() => {
      let previewer = new Previewer()
      previewer.preview(containerRef.current.innerHTML, ['/print.css'], previewRef.current).then((flow) => {
        console.log('Rendered', flow.total, 'pages.')

        // Set TOC numbers
        const tocElements = previewRef.current.querySelectorAll('.toc li a')
        tocElements.forEach((el) => {
          const targetId = el.getAttribute('href').substring(1)
          for (let i = 0; i < flow.pages.length; i++) {
            const page = flow.pages[i]
            const target = page.element.querySelector(`#${targetId}`)
            if (target) {
              const numberEl = document.createElement('span')
              numberEl.classList.add('tocPage')
              numberEl.innerText = i + 1
              el.insertAdjacentElement('afterbegin', numberEl)
            }
          }
        })
        console.log('rendered toc')
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
            <ol className="toc">
              {chapterList.map((el, i) => {
                return (
                  <li key={`toc.${i}`}>
                    <a className="tocItem" href={`#chapter-${el.order}`}>
                      {el.title}
                    </a>
                  </li>
                )
              })}
            </ol>
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
        <PostBody unit={data.posts.nodes[0]} site={data.site} content={children} setChapterList={setChapterList} />
      </div>
    </>
  )
}
export default LearningUnit
