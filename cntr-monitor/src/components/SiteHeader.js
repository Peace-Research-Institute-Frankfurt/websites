import React, { useState } from 'react'
import { Link } from 'gatsby-plugin-react-i18next'
import Logo from '../images/logo-reverse.svg'
import TermsIcon from '../images/terms.svg'
import SearchForm from './SearchForm'
import Hamburger from './Hamburger'
import * as styles from './SiteHeader.module.scss'

export default function SiteHeader({ color, issue, translationData, pages, children }) {
  const [menuIsActive, setMenuIsActive] = useState(false)

  const termsPage = pages.find((node) => {
    return node.base === 'terms.mdx'
  })

  return (
    <header className={`${styles.container}`} style={{ '--color': color }}>
      <div className={`${styles.menuBackdrop} ${menuIsActive ? styles.menuBackdropActive : ''}`}></div>
      <span className={styles.title}>
        <Link to="/" className={`${styles.title}`}>
          <Logo />
          <span>Monitor</span>
        </Link>
        {issue && (
          <Link to={`/${issue.childMdx.frontmatter.year}`} className={styles.year}>
            {issue.childMdx.frontmatter.title}
          </Link>
        )}
      </span>
      <button
        onClick={() => {
          setMenuIsActive(!menuIsActive)
        }}
        className={styles.toggleMenu}
      >
        Menu
        <Hamburger open={menuIsActive} />
      </button>
      <div className={`${styles.menu} ${menuIsActive ? styles.menuActive : ''}`}>
        <div class={styles.menuMain}>
          <SearchForm />
          {termsPage && (
            <Link
              className={styles.menuLink}
              activeStyle={{ background: 'white', color: 'var(--blue-dark)' }}
              to={`/${termsPage.childMdx.fields.slug}`}
            >
              <TermsIcon />
              <span>{termsPage.childMdx.frontmatter.title}</span>
            </Link>
          )}
        </div>
        <div className={styles.tools}>{children}</div>
      </div>
    </header>
  )
}
