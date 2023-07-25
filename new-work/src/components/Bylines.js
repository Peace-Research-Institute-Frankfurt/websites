import React from 'react'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import * as styles from './Bylines.module.scss'

export default function Bylines({ authors }) {
  if (!authors) return <></>
  const authorEls = authors.map((author, i) => {
    const fm = author.frontmatter
    const authorImage = getImage(fm.image)
    return (
      <li className={styles.person} key={`${fm.name}-${i}`}>
        <p>
          <span className={styles.name}>{fm.name}</span>
          {fm.institution && <span> ({fm.institution})</span>}
        </p>
      </li>
    )
  })

  return (
    <div className={styles.container}>
      <ul>{authorEls}</ul>
    </div>
  )
}
