import React from 'react'
import { Link } from 'gatsby'
import { useI18next } from 'gatsby-plugin-react-i18next'
import * as styles from './LanguageSwitcher.module.scss'

export default function LanguageSwitcher({ translationData, translations }) {
  const { languages } = useI18next()
  const currentLanguage = translationData.currentLanguage

  const languageLinks = languages.map((l, i) => {
    const t = translations.find((el) => el.language === l)
    let inner = <span className={styles.inner}>{l}</span>
    if (t) {
      inner = (
        <Link className={styles.inner} to={t.path}>
          {l}
        </Link>
      )
    }
    return (
      <li key={`language-link-${i}`} className={`${styles.item} ${l === currentLanguage && styles.itemCurrent}`}>
        {inner}
      </li>
    )
  })

  return <ul className={styles.container}>{languageLinks}</ul>
}
