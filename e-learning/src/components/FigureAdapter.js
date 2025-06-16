import React, { useState, useEffect }  from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import Figure from '@shared/components/Figure'

export default function FigureAdapter({ styles, caption, credit, size, alt, src, license, discourageSaving, expandable }) {
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

// Check if src is an external URL if image not found
if (!image && src?.startsWith('http')) {
  let extension = 'external'
  const match = src.toLowerCase().match(/\.(svg|jpg|jpeg|png|gif|webp)$/)
  if (match) extension = match[1]
  
  image = {
    extension: extension,
    publicURL: src,
  }
}

  // Let's find our license
  let licenseNode = null
  data.licenses.nodes.forEach((l) => {
    if (l.license_id === license) {
      licenseNode = l
    }
  })
  const [lightboxTargetEl, setLightboxTargetEl] = useState(null)

  // Prepare render target for lightboxes
  useEffect(() => {
    setLightboxTargetEl(document.querySelector('#lightboxes'))
  }, [setLightboxTargetEl])

  return (
    <Figure
      styles={styles}
      image={image}
      src={src}
      expandable={expandable}
      lightboxTargetEl={lightboxTargetEl}
      caption={caption}
      license={licenseNode}
      credit={credit}
      alt={alt}
      size={size}
      discourageSaving={discourageSaving || false}
    />
  )
}
