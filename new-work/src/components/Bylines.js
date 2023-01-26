import React from 'react'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import { gri } from './util'
import * as styles from './Bylines.module.scss'

export default function Bylines({ authors }) {
  if (!authors) return null
  const authorImages = authors.map((author, i) => {
    const fm = author.frontmatter
    const authorImage = getImage(fm.image)
    return (
      <GatsbyImage
        objectFit="contain"
        style={{ transform: `rotate(${gri(-20, 20)}deg)` }}
        className={styles.image}
        image={authorImage}
        alt={`${fm.name} profile image`}
        key={`authorImage-${i}`}
      />
    )
  })
  const authorNames = authors.map((author) => {
    const fm = author.frontmatter
    return (
      <span className={styles.person} key={fm.name}>
        <span className={styles.name}>{fm.name}</span>
        {fm.institution && <span> ({fm.institution})</span>}
      </span>
    )
  })

  const slice = authors.length > 1 ? -1 : 1
  const authorNamesEl = (
    <>
      {authorNames.slice(0, slice).reduce((prev, curr) => [prev, ', ', curr])}
      {authors.length > 1 && <> und {authorNames[authors.length - 1]}</>}
    </>
  )

  return (
    <div className={styles.container}>
      <ul className={styles.images} aria-hidden={true}>
        {authorImages}
      </ul>
      <p className={styles.names}>{authorNamesEl}</p>
    </div>
  )
}
