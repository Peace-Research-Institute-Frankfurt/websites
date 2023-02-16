import React from 'react'
import { Link } from 'gatsby'
import { GatsbyImage } from 'gatsby-plugin-image'

import UnitChip from './UnitChip'
import ArrowRight from '../assets/icons/arrow-right.svg'

import * as styles from './LearningUnitHeader.module.scss'

export default function LearningUnitHeader({ image, alt, order, title, intro, startLink, background, bylines }) {
  const headerStyles = {
    '--background': background,
  }
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <GatsbyImage className={styles.headerImage} image={image} alt={alt} />
        <div className={styles.headerCopy} style={headerStyles}>
          <div>
            <p className={styles.headerEyebrow}>
              <UnitChip>Unit {order}</UnitChip>
            </p>
            <h1 className={styles.headerTitle}>{title}</h1>
            <p className={styles.headerIntro}>{intro}</p>
          </div>
          <Link className={styles.headerCta} to={startLink}>
            Start <ArrowRight />
          </Link>
        </div>
      </div>
    </header>
  )
}
