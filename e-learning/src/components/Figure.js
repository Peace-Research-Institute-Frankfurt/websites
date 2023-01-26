import { graphql, useStaticQuery } from 'gatsby'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import * as FigureStyles from './Figure.module.scss'
import React from 'react'

export default function Figure(props) {
  const data = useStaticQuery(graphql`
    query ImageQuery {
      licenses: allLicensesJson {
        nodes {
          title
          license_id
          url
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
    if (img.base === props.src) {
      image = img
    }
  })
  data.svgs.nodes.forEach((img) => {
    if (img.base === props.src) {
      image = img
    }
  })
  // Let's find our license
  let license = null
  data.licenses.nodes.forEach((l) => {
    if (l.license_id === props.license) {
      license = l
    }
  })

  let size = props.size

  let imageEl = <>Image not found ({props.src})</>

  if (image) {
    if (image.extension === 'svg') {
      imageEl = <img className={FigureStyles.image} alt={props.alt} src={image.publicURL} />
    } else {
      imageEl = <GatsbyImage className={FigureStyles.image} image={getImage(image)} alt={props.alt}></GatsbyImage>
    }
  }

  return (
    <figure className={[FigureStyles[size], FigureStyles.container].join(' ')}>
      {imageEl}
      <figcaption className={FigureStyles.caption}>
        <span>{props.caption}</span>
        <span className={FigureStyles.credit}>
          <>{props.credit}</>
          {license && (
            <>
              {','} <a href={license.url}>{license.title}</a>
            </>
          )}
        </span>
      </figcaption>
    </figure>
  )
}
