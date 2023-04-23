import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'

export default function FigureAdapter({ styles, caption, credit, size, alt, src, license }) {
  const data = useStaticQuery(graphql`
    query ImageQuery {
      licenses: allLicensesJson {
        nodes {
          title
          license_id
          url
        }
      }
      images: allFile(filter: { extension: { nin: ["mdx", "json", "mp3", "svg", "csv", "md"] } }) {
        nodes {
          relativePath
          base
          name
          extension
          publicURL
          childImageSharp {
            gatsbyImageData(layout: FULL_WIDTH, placeholder: BLURRED)
          }
        }
      }
      svgs: allFile(filter: { extension: { in: ["svg"] } }) {
        nodes {
          base
          extension
          publicURL
        }
      }
    }
  `)

  // Let's find our image
  let image = null
  data.images.nodes.forEach((img) => {
    if (img.base === src) {
      image = img
    }
  })
  data.svgs.nodes.forEach((img) => {
    if (img.base === src) {
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
    <figure>
      {image && image.publicURL ? <img src={image.publicURL} alt={alt} /> : <>IMAGE MISSING</>}
      <figcaption>
        <span className="caption">{caption}</span>
        <span className="credit">
          {credit && <>{credit}</>}
          {licenseNode && <> ({licenseNode.title})</>}
        </span>
      </figcaption>
    </figure>
  )
}
