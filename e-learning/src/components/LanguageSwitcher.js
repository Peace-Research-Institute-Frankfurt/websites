import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'gatsby'
import { useI18next } from 'gatsby-plugin-react-i18next'
import * as styles from './LanguageSwitcher.module.scss'

export default function LanguageSwitcher({ translationData, translations }) {
  const { languages } = useI18next()
  const currentLanguage = translationData.currentLanguage
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  // Schließt das Dropdown bei einem Klick außerhalb
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const otherLanguages = languages.filter((l) => l !== currentLanguage)

  const languageLinks = otherLanguages.map((l) => {
    const t = translations.find((el) => el.language === l)

    return (
      <li key={`language-link-${l}`} className={styles.item}>
        {t ? (
          <Link
            className={styles.inner}
            to={t.path}
            onClick={() => setIsOpen(false)}
          >
            {l}
          </Link>
        ) : (
          <span className={styles.inner}>{l}</span>
        )}
      </li>
    )
  })

  return (
    <div className={styles.container} ref={containerRef}>
      <button
        type="button"
        className={`${styles.current} ${isOpen ? styles.currentOpen : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls="language-menu"
        aria-label={`Current language: ${currentLanguage}. Change language`}
      >
        <span>{currentLanguage}</span>
        <span
          className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ''}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <ul id="language-menu" className={styles.dropdown}>
          {languageLinks}
        </ul>
      )}
    </div>
  )
}