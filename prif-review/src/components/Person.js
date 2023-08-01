import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import * as styles from './Person.module.scss'

const Person = function ({ name, image, children }) {
  const data = useStaticQuery(graphql`
    query PersonQuery {
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
    imageEl = <GatsbyImage className={styles.image} loading="lazy" image={getImage(img)} alt={''} />
  }
  return (
    <aside className={styles.container}>
      {img && imageEl}
      <div className={styles.bio}>
        <h2 className={styles.name}>{name}</h2>
        {children}
      </div>
    </aside>
  )
}

const PersonList = function ({ title, children }) {
  return (
    <section className={styles.list}>
      <h3 className={styles.listTitle}>{title}</h3>
      {children}
    </section>
  )
}

export { Person, PersonList }
