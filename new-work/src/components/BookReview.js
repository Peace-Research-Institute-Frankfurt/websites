import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import MarkdownRenderer from 'react-markdown-renderer'
import * as styles from './BookReview.module.scss'

const BookReview = ({ title, covers, meta, children }) => {
  const data = useStaticQuery(graphql`
    query BookReviewQuery {
      images: allFile(filter: { extension: { in: ["png", "jpg", "jpeg"] } }) {
        nodes {
          id
          relativePath
          childImageSharp {
            gatsbyImageData(layout: CONSTRAINED, placeholder: BLURRED, width: 200)
          }
        }
      }
    }
  `)

  if (!Array.isArray(covers)) {
    covers = [covers]
  }

  let coverImages = []

  covers.forEach((cover, i) => {
    for (let j = 0; j < data.images.nodes.length; j++) {
      let node = data.images.nodes[j]
      if (node.relativePath.toLowerCase() === cover.src.toLowerCase()) {
        coverImages = [...coverImages, <GatsbyImage key={node.id} loading="lazy" image={getImage(node)} alt={cover.alt} />]
        break
      }
      i++
    }
  })

  return (
    <li className={styles.container}>
      <aside className={styles.meta}>
        {coverImages.length > 0 && (
          <div style={{ marginBottom: `${0.5 * coverImages.length}em` }} className={styles.covers}>
            {coverImages}
          </div>
        )}
        {meta && (
          <ul>
            {Object.keys(meta).map((key) => {
              return (
                <li key={`${title}.${key}`}>
                  <span className={styles.metaLabel}>{key}</span>
                  <MarkdownRenderer markdown={meta[key]} />
                </li>
              )
            })}
          </ul>
        )}
      </aside>
      <div className={styles.description}>
        {title && <h2 className={styles.title}>{title}</h2>}
        {children}
      </div>
    </li>
  )
}
const BookReviewList = ({ children }) => {
  return <ul className={styles.list}>{children}</ul>
}

export { BookReview, BookReviewList }
