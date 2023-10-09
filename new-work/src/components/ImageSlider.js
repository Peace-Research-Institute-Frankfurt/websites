import React, { useState } from 'react'
import Button from './ButtonAdapter'
import ButtonGroup from './ButtonGroup'
import { useStaticQuery, graphql } from 'gatsby'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import MarkdownRenderer from 'react-markdown-renderer'
import ArrowRight from '../images/arrow-right.svg'
import ArrowLeft from '../images/arrow-left.svg'
import * as styles from './ImageSlider.module.scss'

export default function ImageSlider({ images }) {
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

  const [currentSlide, setCurrentSlide] = useState(0)
  const slides = images.map((el, i) => {
    // Let's find our image
    let image = null
    data.images.nodes.forEach((img) => {
      if (img.relativePath.toLowerCase() === el.src.toLowerCase()) {
        image = img
      }
    })

    return (
      <li className={`${styles.slide} ${currentSlide === i ? styles.active : ''}`}>
        <figure className={styles.figure}>
          <GatsbyImage
            style={{ height: '100%', width: '100%' }}
            imgStyle={{ objectFit: 'contain', objectPosition: 'left' }}
            className={styles.image}
            image={getImage(image)}
            alt={el.alt}
          ></GatsbyImage>

          <div className={styles.captions}>
            <span className={styles.index}>
              {i + 1}/{images.length}
            </span>
            {el.caption && (
              <figcaption>
                <MarkdownRenderer markdown={el.caption} />
              </figcaption>
            )}

            {el.credit && (
              <figcaption className={styles.credit}>
                <MarkdownRenderer markdown={el.credit} />
              </figcaption>
            )}
          </div>
        </figure>
      </li>
    )
  })

  function advance(n) {
    setCurrentSlide((prev) => {
      if (prev + n > slides.length - 1) {
        return 0
      } else if (prev + n < 0) {
        return slides.length - 1
      }
      return prev + n
    })
  }

  return (
    <div className={styles.container}>
      <ul className={styles.slides}>{slides}</ul>
      <div className={styles.controls}>
        <ButtonGroup>
          <Button
            label="Zurück"
            priority="secondary"
            hideLabel={true}
            icon={<ArrowLeft />}
            size="small"
            onClick={() => {
              advance(-1)
            }}
          />
          <Button
            label="Weiter"
            size="small"
            hideLabel={true}
            icon={<ArrowRight />}
            priority="secondary"
            onClick={() => {
              advance(1)
            }}
          />
        </ButtonGroup>
      </div>
    </div>
  )
}
