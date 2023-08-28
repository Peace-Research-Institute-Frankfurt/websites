import React from 'react'
import { Link } from 'gatsby'
import Logo from '../images/logo.svg'
import useScrollPosition from '@shared/hooks/useScrollPosition'
import * as styles from './SiteHeader.module.scss'

export default function SiteHeader({ report, post, translationData, children }) {
  const homePath = translationData.currentLanguage !== 'de' ? `/${translationData.currentLanguage}` : '/'

  const scrollPosition = useScrollPosition()
  const isScrolled = scrollPosition.y > 250

  return (
    <header className={`${styles.container} ${isScrolled ? styles.isScrolled : ''}`}>
      <div className={styles.inner}>
        <Link to={homePath} className={`${styles.title}`}>
          <div className={styles.titleInner}>
            <Logo />
            <span>Review</span>
          </div>
        </Link>
        {report && (
          <div className={styles.section}>
            <p className={styles.sectionInner}>
              <span className={styles.sectionReport}>
                {report.childMdx.frontmatter.title} {report.relativeDirectory.replace(/(.{2})\/(reports)\//g, '')}
              </span>
              {post && <span className={styles.sectionPost}>{post.childMdx.frontmatter.title}</span>}
            </p>
          </div>
        )}
        <div className={styles.controls}>{children}</div>
      </div>
    </header>
  )
}
