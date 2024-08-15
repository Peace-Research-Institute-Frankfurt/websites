import React, { useState, useEffect } from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import Figure from '@shared/components/Figure'
import MarkdownRenderer from 'react-markdown-renderer'

export default function FigureAdapter({ styles, caption, credit, size, alt, src, license, expandable }) {
  const data = useStaticQuery(graphql`
    query ImageQuery {
      licenses: allLicensesJson {
        nodes {
          title
          license_id
          url
        }
      }
      svgs: allFile(filter: { extension: { eq: "svg" } }) {
        nodes {
          relativePath
          base
          name
          extension
          publicURL
        }
      }
      images: allFile(filter: { extension: { nin: ["mdx", "json", "mp3", "svg"] } }) {
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
  let imageNode = null
  const fileNodes = [...data.images.nodes, ...data.svgs.nodes]
  fileNodes.forEach((node) => {
    if (node.base.toLowerCase() === src.toLowerCase()) {
      imageNode = node
    }
  })
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
      image={imageNode}
      styles={styles}
      src={src}
      expandable={expandable}
      lightboxTargetEl={lightboxTargetEl}
      caption={caption}
      license={licenseNode}
      credit={<MarkdownRenderer markdown={credit} />}
      alt={alt}
      size={size}
    />
  )
}
