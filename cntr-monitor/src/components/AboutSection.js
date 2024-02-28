import React from 'react'
import { Link, useTranslation } from 'gatsby-plugin-react-i18next'
import * as styles from './AboutSection.module.scss'

const AboutSection = () => {
  const { t } = useTranslation()
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{t('About')}</h2>
      <p className={styles.copy}>
        {t(
          "The CNTR Monitor is an open-access publication on trends on technology and arms control and the core product of CNTR's research. In addition to analyses of individual technologies and reports on Research & Development (R&D) activities, the CNTR Monitor highlights opportunities for political control and capacities in selected regions."
        )}
      </p>
    </section>
  )
}

export default AboutSection
