import React from 'react'
import { Link } from 'gatsby'
import Logo from '../images/logo-reverse.svg'
import * as styles from './SiteHeader.module.scss'

export default function SiteHeader({ post, issue, translationData, children }) {
  const homePath = translationData.currentLanguage !== 'de' ? `/${translationData.currentLanguage}` : '/'

  return (
    <header className={`${styles.container}`}>
      <div className={styles.inner}>
        <Link to={homePath} className={`${styles.title}`}>
          <Logo />
          <span>Monitor</span>
          <span className={styles.year}>2024</span>
        </Link>
        {issue && (
          <div>
            <p>
              <span>
                {issue.childMdx.frontmatter.title} {issue.relativeDirectory.replace(/(.{2})\/(issues)\//g, '')}
              </span>
              {post && <span>{post.childMdx.frontmatter.title}</span>}
            </p>
          </div>
        )}
        <div className={styles.controls}>{children}</div>
      </div>
    </header>
  )
}
