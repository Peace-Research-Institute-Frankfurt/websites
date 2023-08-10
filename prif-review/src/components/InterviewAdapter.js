import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import * as styles from './Interview.module.scss'
import { Interview, InterviewQuestion, InterviewParticipant } from '@shared/components/Interview'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'

const InterviewAdapter = function ({ ...props }) {
  return <Interview styles={styles} {...props} />
}
const InterviewQuestionAdapter = function ({ ...props }) {
  return <InterviewQuestion styles={styles} {...props} />
}

const InterviewParticipantAdapter = function ({ image, image_alt, ...props }) {
  const data = useStaticQuery(graphql`
    query InterviewParticipantQuery {
      images: allFile(filter: { extension: { in: ["png", "jpg", "jpeg"] } }) {
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
  let img = null
  if (image) {
    data.images.nodes.forEach((node) => {
      if (node.relativePath.toLowerCase() === image.toLowerCase()) {
        img = node
      }
    })
  }

  let imageEl = <></>
  if (img) {
    imageEl = <GatsbyImage className={styles.participantImage} loading="lazy" image={getImage(img)} alt={image_alt || ''} />
  }

  return <InterviewParticipant styles={styles} image={imageEl} {...props} />
}

export { InterviewAdapter, InterviewQuestionAdapter, InterviewParticipantAdapter }
