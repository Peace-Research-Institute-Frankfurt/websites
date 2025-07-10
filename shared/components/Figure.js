import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import ExpandIcon from '../assets/expand.svg'
import CollapseIcon from '../assets/collapse.svg'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
export default function Figure({
  styles,
  image,
  license,
  caption,
  credit,
  size,
  alt,
  src,
  expandable,
  lightboxTargetEl,
  className,
  discourageSaving,
}) {
  if (!styles) styles = {}

  const [isExpanded, setIsExpanded] = useState(false)

  const handleKeyUp = (e) => {
    if (e.key === 'Escape') {
      setIsExpanded(false)
    }
  }

  let imageEl = <>Image not found ({src})</>

if (image) {
  const gatsbyImage = getImage(image)
  if (gatsbyImage) {
    // Gatsby-optimiertes Bild
    imageEl = <GatsbyImage className={styles.image} image={gatsbyImage} alt={alt} />
  } else if (image.publicURL) {
    // Externes Bild oder SVG
    imageEl = <img className={styles.image} alt={alt} src={image.publicURL} />
  }
}

  return (
    <>
      <figure
        onKeyUp={handleKeyUp}
        className={`${styles.container} ${styles[size]} ${discourageSaving ? styles.discourageSaving : ''} ${className ? className : ''}`}
      >
        <div className={styles.inner}>
          <div className={styles.imageContainer}>
            {imageEl}
            {expandable && (
              <button
                onClick={() => {
                  setIsExpanded(!isExpanded)
                }}
                className={styles.expand}
              >
                <ExpandIcon />
                Expand
              </button>
            )}
          </div>
          {(credit || caption) && (
            <figcaption className={styles.captions}>
              {caption && (
                <span className={styles.caption}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ node, ...props }) => <span {...props} />, // Kein <p>-Block
                      a: ({ node, ...props }) => (
                        <a {...props} target="_blank" rel="noopener noreferrer" />
                      ), // Links im neuen Tab
                    }}
                  >
                    {caption}
                  </ReactMarkdown>
                </span>
              )}
              {credit && (
                <span className={styles.credit}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ node, ...props }) => <span {...props} />, // Kein <p>
                      a: ({ node, ...props }) => (
                        <a {...props} target="_blank" rel="noopener noreferrer" />
                      ), // Links im neuen Tab
                    }}
                  >
                    {`Source: ${credit}${license ? `, [${license.title}](${license.url})` : ''}.`}
                  </ReactMarkdown>
                </span>
              )}
            </figcaption>
          )}
        </div>
      </figure>
      {expandable &&
        lightboxTargetEl &&
        createPortal(
          <div className={`${styles.lightbox} ${isExpanded ? styles.lightboxActive : ''}`}>
            <div className={styles.lightboxMedia}>
              {imageEl}
              <button
                className={styles.collapse}
                onClick={() => {
                  setIsExpanded(false)
                }}
              >
                <CollapseIcon />
                Collapse
              </button>
            </div>
          </div>,
          lightboxTargetEl
        )}
    </>
  )
}
