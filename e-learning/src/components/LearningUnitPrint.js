import { graphql } from 'gatsby'
import React, { useEffect, useRef, useState } from 'react'
import PostBody from './PrintPostBody'
import FundingLogo from '../assets/icons/funded-by-eu.svg'
import * as styles from './LearningUnitPrint.module.scss'
import { Previewer } from 'pagedjs'
import './paged.scss'
import authorsToString from './authorsToString'

export const query = graphql`
  query ($lu_id: String, $id: String) {
    site: site {
      buildTime(formatString: "D MMMM Y")
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

        // Setting page numbers and running headers with pseudo-elements
        // produces an inaccessible PDF, so we set them with Javascript instead.

        // Set page numbers
        const pageNumberElements = previewRef.current.querySelectorAll('.pageNumber')
        pageNumberElements.forEach((el, i) => {
          el.innerText = `${i}`
        })

        // Set running headers
        const pageElements = previewRef.current.querySelectorAll('.pagedjs_page')
        const chapterTitles = []
        pageElements.forEach((el) => {
          const chapterTitle = el.querySelector('.chapterTitle')
          const runningTitleElement = el.querySelector('.runningTitle')
          if (chapterTitle) {
            const titleText = chapterTitle.innerText
            runningTitleElement.innerText = titleText
            chapterTitles.push(titleText)
          } else {
            runningTitleElement.innerText = chapterTitles[chapterTitles.length - 1]
          }
        })

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
              el.setAttribute('data-page', i + 1)
              el.insertAdjacentElement('afterbegin', numberEl)
            }
          }
        })

        // Remove Gatsby elements
        const removeElements = document.querySelectorAll('gatsby-qod,div#query-on-demand-indicator-element,div#gatsby-announcer')
        removeElements.forEach((el) => el.remove())

        // Draw table strokes and outlines
        // (We do this in SVG to get crisp hairlines in the PDF)
        const tableElements = previewRef.current.querySelectorAll('table')
        tableElements.forEach((tableEl) => {
          const containerRect = tableEl.getBoundingClientRect()
          const rows = tableEl.querySelectorAll('tr')
          const cells = rows[0].querySelectorAll('td, th')
          const lines = []

          // Draw column strokes
          for (let i = 0; i < cells.length - 1; i++) {
            const { right } = cells[i].getBoundingClientRect()
            const x = ((right - containerRect.x) / containerRect.width) * 100
            lines.push({ x1: x, x2: x, y1: 0, y2: 100 })
          }
          for (let i = 0; i < rows.length - 1; i++) {
            const { bottom } = rows[i].getBoundingClientRect()
            const y = ((bottom - containerRect.y) / containerRect.height) * 100
            lines.push({ x1: 0, x2: 100, y1: y, y2: y })
          }

          // Generate SVG
          const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
          svgEl.setAttribute('viewBox', '0 0 100 100')
          svgEl.setAttribute('preserveAspectRatio', 'none')
          svgEl.classList.add('tableStrokes')
          lines.forEach((line) => {
            const lineEl = document.createElementNS('http://www.w3.org/2000/svg', 'line')
            lineEl.setAttribute('x1', line.x1)
            lineEl.setAttribute('x2', line.x2)
            lineEl.setAttribute('y1', line.y1)
            lineEl.setAttribute('y2', line.y2)
            svgEl.insertAdjacentElement('beforeend', lineEl)
          })

          // Draw outline
          const outlineEl = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
          outlineEl.setAttribute('x', 0)
          outlineEl.setAttribute('y', 0)
          outlineEl.setAttribute('width', 100)
          outlineEl.setAttribute('height', 100)
          svgEl.insertAdjacentElement('beforeend', outlineEl)

          tableEl.insertAdjacentElement('afterend', svgEl)
        })
      })
    }, 500)
  }, [])

  return (
    <>
      <div ref={previewRef}></div>
      <div className={styles.container} ref={containerRef}>
        <div className="runningHeaderLeft">
          <span className="runningTitle">Chapter Title</span>
        </div>
        <div className="runningHeaderRight">
          <span>EUNPDC eLearning / Unit {unit.order}</span>
        </div>
        <div className="runningFooterRight">
          <span className="retrieved">Generated {timestamp}</span>
        </div>
        <div className="runningFooterLeft">
          <span className="pageNumber">Page 2</span>
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
                    <a data-label={`${el.order}. ${el.title}`} className="tocItem" href={`#chapter-${el.order}`}>
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
            <div className="coverCitation">
              <p>
                Cite as: {authorsToString(unit.authors)}, "{unit.title}" in EUNPDC eLearning, ed. Niklas Schoernig, Peace Research Institute
                Frankfurt. Available at {data.site.siteMetadata.siteUrl}
                {data.posts.nodes[0].childMdx.fields.slug}, last modified {data.site.buildTime}
              </p>
            </div>
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
