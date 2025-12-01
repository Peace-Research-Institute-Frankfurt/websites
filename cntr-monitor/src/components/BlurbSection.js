import React from 'react'
import { useTranslation } from 'gatsby-plugin-react-i18next'
import * as styles from './BlurbSection.module.scss'

const BlurbSection = ({ year }) => {
  const { t } = useTranslation()
  const text = t(`BlurbText_${year}`)
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t('Blurb')}</h2>
      <p className={styles.copy}>{text}</p>
    </div>
  )
}

export default BlurbSection