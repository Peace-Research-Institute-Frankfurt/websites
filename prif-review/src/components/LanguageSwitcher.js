import React from 'react'
import {Link} from "gatsby"
import { useI18next } from 'gatsby-plugin-react-i18next'
import * as styles from './LanguageSwitcher.module.scss'

export default function LanguageSwitcher({ translationData, translations }) {
  const { languages, path } = useI18next()
  const currentLanguage = translationData.currentLanguage
  const currentSlug = translationData.currentSlug

  // TODO: Move this to <Meta/>
  let alternateLinks = <>No explicit translations</>;
  if (translations){
    alternateLinks = translations.map((t, i) => {
      const language = "TODO"
     const path = `[siteUrl]${t.path}`
     return <span key={`alternate-${i}`} rel="alternate" hrefLang={t.language} href={path}>{path}</span>
   })
  }
  
  const languageLinks = languages.map((l, i) => {
    const t = translations.find(el => el.language === l)
    let inner = <>{l}</>
    if (t){
      inner = <Link to={t.path}>{l}</Link>      
    }
    return (
      <li key={`language-link-${i}`} className={`${styles.link} ${l === currentLanguage && styles.linkCurrent}`}>
        {inner}
      </li>
    )
  })

  return (
    <>
      {alternateLinks}
      <ul className={styles.container}>{languageLinks}</ul>
    </>
  )
}
