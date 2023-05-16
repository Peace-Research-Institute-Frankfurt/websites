import React from 'react'
import { Link, useI18next } from 'gatsby-plugin-react-i18next'
import * as styles from './LanguageSwitcher.module.scss'

export default function LanguageSwitcher({ translationData }) {
  const { languages, path } = useI18next()
  const translations = translationData.translations || []
  const currentLanguage = translationData.currentLanguage
  const currentSlug = translationData.currentSlug

  const languageLinks = languages.map((l) => {
    const translation = translations.find((t) => {
      return l === t.childMdx.fields.locale
    })
    const originalPath = path.replace(`en/`, '').replace(/^\//, '')
    let targetPath = originalPath
    if (translation) {
      // Swap out the slug
      targetPath = originalPath.replace(currentSlug, translation.childMdx.fields.slug)
    }

    return (
      <li key={l}>
        <Link to={`/${targetPath}`} language={l} className={`${styles.link} ${l === currentLanguage && styles.linkCurrent}`}>
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
