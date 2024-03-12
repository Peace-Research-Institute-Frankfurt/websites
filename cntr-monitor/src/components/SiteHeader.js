import React from 'react'
import { Link } from 'gatsby-plugin-react-i18next'
import Logo from '../images/logo-reverse.svg'
import SearchForm from './SearchForm'
import * as styles from './SiteHeader.module.scss'

export default function SiteHeader({ color, issue, translationData, pages, children }) {
  const homePath = translationData.currentLanguage !== 'de' ? `/${translationData.currentLanguage}/` : '/'

  const termsPage = pages.find((node) => {
    return node.base === 'terms.mdx'
  })

  return (
    <header className={`${styles.container}`} style={{ '--color': color }}>
      <span className={styles.title}>
        <Link to={homePath} className={`${styles.title}`}>
          <Logo />
          <span>Monitor</span>
        </Link>
        {issue && (
          <Link to={`${homePath}${issue.childMdx.frontmatter.year}`} className={styles.year}>
            {issue.childMdx.frontmatter.title}
          </Link>
        )}
      </span>
      <div className={styles.controls}>
        <SearchForm />
        {termsPage && (
          <Link activeStyle={{ background: 'white', color: 'var(--blue-dark)' }} to={`/${termsPage.childMdx.fields.slug}`}>
            {termsPage.childMdx.frontmatter.title}
          </Link>
        )}

        {children}
      </div>
    </header>
  )
}
