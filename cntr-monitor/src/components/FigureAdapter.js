import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import Figure from '@shared/components/Figure'
import * as styles from './Figure.module.scss'

export default function FigureAdapter({ caption, credit, size, alt, src, license, className }) {
  const data = useStaticQuery(graphql`
    query ImageQuery {
      licenses: allLicensesJson {
        nodes {
          title
          license_id
          url
        }
      }
      images: allFile(filter: { extension: { nin: ["mdx", "json", "mp3", "csv"] } }) {
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
    if (img.relativePath.toLowerCase() === src.toLowerCase()) {
      image = img
    }
  })
  // Let's find our license
  let licenseNode = null
  data.licenses.nodes.forEach((l) => {
    if (l.license_id === license) {
      licenseNode = l
    }
  })
return (
  <figure className={className}>
    <Figure
      styles={styles}
      image={image}
      src={src}
      license={licenseNode}
      alt={alt}
      size={size}
    />
    {(caption || credit) && (
      <figcaption className={styles.captions}>
        {caption && (
          <span className={styles.caption}>
            {caption}
          </span>
        )}
        {credit && (
          <span className={styles.credit}>
            Source: {credit}{licenseNode && <>, <a href={licenseNode.url} target="_blank" rel="noopener noreferrer">{licenseNode.title}</a></>}.
          </span>
        )}
      </figcaption>
    )}
  </figure>
)
}
