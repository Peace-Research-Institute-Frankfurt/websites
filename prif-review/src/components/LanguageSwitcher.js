import React from 'react'
import { Link } from 'gatsby'
import { useI18next } from 'gatsby-plugin-react-i18next'
import * as styles from './LanguageSwitcher.module.scss'

export default function LanguageSwitcher({ translationData, translations }) {
  const { languages } = useI18next()
  const currentLanguage = translationData.currentLanguage

  const languageLinks = languages.map((l, i) => {
    const t = translations.find((el) => el.language === l)
    let inner = <>{l}</>
    if (t) {
      inner = <Link to={t.path}>{l}</Link>
    }
    return (
      <li key={`language-link-${i}`} className={`${styles.link} ${l === currentLanguage && styles.linkCurrent}`}>
        {inner}
      </li>
    )
  })

  return <ul className={styles.container}>{languageLinks}</ul>
}
