import { graphql, useStaticQuery } from 'gatsby'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import React from 'react'
import * as styles from './Figure.module.scss'

export default function Figure({ caption, credit, size, alt, ...props }) {
  const data = useStaticQuery(graphql`
    query ImageQuery {
      licenses: allLicensesJson {
        nodes {
          title
          license_id
          url
        }
      }
      images: allFile(filter: { extension: { nin: ["mdx", "json", "mp3"] } }) {
        nodes {
          relativePath
          base
          name
          extension
          publicURL
          childImageSharp {
            gatsbyImageData(layout: CONSTRAINED, placeholder: BLURRED)
          }
        }
      }
    }
  `)

  // Let's find our image
  let image = null
  data.images.nodes.forEach((img) => {
    if (img.base.toLowerCase() === props.src.toLowerCase()) {
      image = img
    }
  })
  // Let's find our license
  let license = null
  data.licenses.nodes.forEach((l) => {
    if (l.license_id === license) {
      license = l
    }
  })

  let imageEl = <>Image not found ({props.src})</>

  if (image) {
    if (image.extension === 'svg') {
      imageEl = <img className={styles.image} alt={alt} src={image.publicURL} />
    } else {
      imageEl = <GatsbyImage className={styles.image} image={getImage(image)} alt={alt} />
    }
  }

  return (
    <figure className={[styles[size], styles.container].join(' ')}>
      {imageEl}
      <div className={styles.captions}>
        {caption && <figcaption>{caption}</figcaption>}
        {credit && (
          <figcaption className={styles.credit}>
            <>{credit}</>
            {license && (
              <>
                {','} <a href={license.url}>{license.title}</a>
              </>
            )}
          </figcaption>
        )}
      </div>
    </figure>
  )
}
