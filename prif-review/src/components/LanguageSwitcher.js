import React from 'react'
import { Link, useI18next } from 'gatsby-plugin-react-i18next'

export default function LanguageSwitcher({ translations }) {
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
        <Link to={path} language={l}>
          {l} (/{translation && translation.childMdx.frontmatter.title})
        </Link>
      </li>
    )
  })

  return (
    <>
      <ul className="languages">{languageLinks}</ul>
    </>
  )
}
