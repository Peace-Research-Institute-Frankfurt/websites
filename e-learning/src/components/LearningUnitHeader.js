import React from 'react'
import { Link, useTranslation} from 'gatsby-plugin-react-i18next'

import { GatsbyImage } from 'gatsby-plugin-image'
import ArrowRight from '../assets/icons/arrow-right.svg'
import MarkdownRenderer from 'react-markdown-renderer'
import * as styles from './LearningUnitHeader.module.scss'

export default function LearningUnitHeader({ image, title, intro, startLink, background}) {

  const { t } = useTranslation()

  const headerStyles = {
    '--background': background,
  }

  return (
    <header className={styles.container}>

      <figure className={styles.imageContainer}>
        {image.src && (
          <GatsbyImage
            className={styles.headerImage}
            image={image.src}
            alt={image.alt}
          />
        )}

        <figcaption
          className={styles.imageCaption}
        >
          <MarkdownRenderer
            markdown={`${t('Above')}: ${image.caption}`}
          />

          {image.credit && (
            <MarkdownRenderer
              className={styles.imageCredit}
              markdown={image.credit}
            />
          )}
        </figcaption>
      </figure>
      <div className={styles.headerCopy} style={headerStyles}>
        <h1 className={styles.headerTitle}>{title}</h1>
        <p className={styles.headerIntro}>{intro}</p>
        <Link className={styles.headerCta} to={startLink}>
          {t('Start learning unit')}
          <ArrowRight />
        </Link>
      </div>
    </header>
  )
}
