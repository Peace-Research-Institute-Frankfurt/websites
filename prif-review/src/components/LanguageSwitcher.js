import React from 'react'
import { Link, useI18next } from 'gatsby-plugin-react-i18next'
import * as styles from './LanguageSwitcher.module.scss'

export default function LanguageSwitcher({ translations, language }) {
  const { languages, originalPath } = useI18next()
  if (!translations) translations = []

  const languageLinks = languages.map((l) => {
    const translation = translations.find((t) => {
      return l === t.childMdx.fields.locale
    })
    let path = originalPath
    if (translation) {
      path = `/${translation.childMdx.fields.slug}`
    }

    return (
      <li key={l}>
        <Link to={path} language={l} className={`${styles.link} ${l === language && styles.linkCurrent}`}>
          {l}
        </Link>
      </li>
    )
  })

  return (
    <>
      <ul className={styles.container}>{languageLinks}</ul>
    </>
  )
}
