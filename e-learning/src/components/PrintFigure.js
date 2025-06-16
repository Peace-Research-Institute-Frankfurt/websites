import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'

export default function FigureAdapter({ caption, credit, alt, src, license }) {
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
const isExternal = typeof src === 'string' && src.startsWith('http')

if (isExternal) {
  let extension = 'external'
  const match = src.toLowerCase().match(/\.(svg|jpg|jpeg|png|gif|webp)$/)
  if (match) extension = match[1]
  
  image = { 
    publicURL: src,
    extension: extension
  }
} else {
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
}
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
