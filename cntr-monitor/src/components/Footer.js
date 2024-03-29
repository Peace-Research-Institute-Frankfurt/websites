import { Link, useTranslation } from 'gatsby-plugin-react-i18next'
import React from 'react'
import * as styles from './Footer.module.scss'
import Logo from '../images/logo-reverse.svg'

export default function Footer({ pages }) {
  const { t } = useTranslation()

  if (!pages) pages = []
  return (
    <footer className={styles.container}>
      <div className={styles.copy}>
        <nav className={styles.menu}>
          <ul>
            <li>
              <Link className={styles.navLink} activeClassName={styles.navActive} to="/">
                {t('Home')}
              </Link>
            </li>
            {pages.map((p) => {
              return (
                <li key={`navitem-${p.id}`}>
                  <Link className={styles.navLink} activeClassName={styles.navActive} to={`/${p.childMdx.fields.slug}`}>
                    {p.childMdx.frontmatter.title}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        <p className={styles.copyright}>
          {t('© PRIF and the authors')} {new Date().getFullYear()}
        </p>
      </div>
      <a href="https://www.cntrarmscontrol.org/" className={styles.logo}>
        <span>CNTR</span>
        <Logo />
      </a>
    </footer>
  )
}
