import React from 'react'
import { useTranslation } from 'gatsby-plugin-react-i18next'
import * as styles from './AboutSection.module.scss'

const AboutSection = () => {
  const { t } = useTranslation()
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t('About')}</h2>
      <p className={styles.copy}>
        {t(
          "The CNTR Monitor is an annual open-access publication and the core product of CNTR's research. It highlights technological innovations and developments in the natural sciences that are relevant to peace and security. In addition to analyses of individual technologies and reports on research and development (R&D) activities, the Monitor also explores opportunities for arms control and outlines options for political regulation."
        )}
      </p>
    </div>
  )
}

export default AboutSection
