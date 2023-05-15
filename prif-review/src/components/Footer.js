import { graphql, useStaticQuery } from 'gatsby'
import { Link, useTranslation } from 'gatsby-plugin-react-i18next'
import React from 'react'
import * as styles from './Footer.module.scss'

export default function Footer({ pages, language }) {
  const data = useStaticQuery(graphql`
    query {
      meta: site {
        buildTime
      }
    }
  `)
  const { t } = useTranslation()
  const buildDate = new Date(data.meta.buildTime)
  if (language === 'en') language = 'en-UK'
  const buildDateString = new Intl.DateTimeFormat(language, { dateStyle: 'short', timeStyle: 'short', timeZone: 'Europe/Berlin' }).format(buildDate)

  if (!pages) pages = []
  return (
    <footer className={styles.container}>
      <nav>
        <ul>
          <li>
            <Link to="/">{t('Home')}</Link>
          </li>
          {pages.map((p) => {
            return (
              <li key={`navitem-${p.id}`}>
                <Link to={`/${p.childMdx.fields.slug}`}>{p.childMdx.frontmatter.title}</Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <p>
        {t('© PRIF and the authors')} {new Date().getFullYear()}
      </p>
      <p>Built {buildDateString}</p>
    </footer>
  )
}
