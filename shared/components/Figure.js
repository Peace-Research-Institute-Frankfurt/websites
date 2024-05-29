import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import MarkdownRenderer from 'react-markdown-renderer'
import ExpandIcon from '../assets/expand.svg'
import CollapseIcon from '../assets/collapse.svg'

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
    if (image.extension === 'svg') {
      imageEl = <img className={styles.image} alt={alt} src={image.publicURL} />
    } else {
      imageEl = <GatsbyImage className={styles.image} image={getImage(image)} alt={alt} />
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
              {caption && <MarkdownRenderer className={styles.caption} markdown={caption} />}
              {credit && (
                <span className={styles.credit}>
                  <>{credit}</>
                  {license && (
                    <>
                      {','} {license.url ? <a href={license.url}>{license.title}</a> : <>{license.title}</>}.
                    </>
                  )}
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
