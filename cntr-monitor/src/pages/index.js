import React from 'react'
import { graphql } from 'gatsby'
import App from '../components/App'
import Meta from '../components/Meta'
import SkipToContent from '../components/SkipToContent'
import { Link, useTranslation } from 'gatsby-plugin-react-i18next'
import * as styles from './index.module.scss'
import SiteHeader from '../components/SiteHeader'
import Footer from '../components/Footer'
import MarkdownRenderer from 'react-markdown-renderer'

export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: { language: { eq: $language } }) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
    pages: allFile(
      filter: {
        relativeDirectory: { glob: "**/pages/**" }
        extension: { eq: "mdx" }
        sourceInstanceName: { eq: "content" }
        childMdx: { fields: { locale: { eq: $language } } }
      }
    ) {
      nodes {
        id
        childMdx {
          fields {
            slug
          }
          frontmatter {
            title
            order
          }
        }
      }
    }
    issues: allFile(
      filter: {
        extension: { eq: "mdx" }
        sourceInstanceName: { eq: "content" }
        name: { eq: "index" }
        childMdx: { fields: { locale: { eq: $language } } }
      }
      sort: { childMdx: { frontmatter: { order: DESC } } }
    ) {
      nodes {
        id
        relativeDirectory
        childMdx {
          fields {
            slug
            locale
          }
          frontmatter {
            title
            intro
          }
        }
      }
    }
  }
`

const Index = ({ data, pageContext, location }) => {
  const { t } = useTranslation()
  const translationData = { currentLanguage: pageContext.language, currentSlug: location.pathname }

  const currentIssue = data.issues.nodes[0]
  const currentYear = currentIssue.relativeDirectory.replace(/(.{2})\/(issues)\//g, '')

  return (
    <App pages={data.pages.nodes}>
      <SkipToContent />

      <SiteHeader post={data.post} translationData={translationData}></SiteHeader>

      <main className={styles.container}>
        <section className={styles.hero}>
          <div className={styles.heroBlue} />
          <div className={styles.heroBlack} />
          <h1 className={styles.heroTitle}>CNTR Monitor</h1>
          <p className={styles.heroIntro}>
            {t(
              `The CNTR Monitor is an open-access publication on trends on technology and arms control and the core product of CNTR's research. In addition to analyses of individual technologies and reports on research and development (R&D) activities, the CNTR Monitor highlights opportunities for political control and capacities in selected regions.`
            )}
          </p>
        </section>
        <section className={styles.current}>
          <div className={styles.currentInner}>
            <h2 className={styles.sectionTitle}>Current issue</h2>
            <div className={styles.currentIssue}>
              <Link to={`/${currentYear}`}>
                <h2>{currentYear}</h2>
              </Link>
              <div className={styles.currentIntro}>
                <MarkdownRenderer markdown={currentIssue.childMdx.frontmatter.intro} />
              </div>
            </div>
          </div>
        </section>
        <section className={styles.archive}>
          {data.issues.nodes.map((node, i) => {
            const year = node.relativeDirectory.replace(/(.{2})\/(issues)\//g, '')
            return (
              <li key={`issue-${i}`}>
                <Link to={`/${year}`}>
                  <span>{year}</span>
                </Link>
              </li>
            )
          })}
        </section>
      </main>
      <Footer pages={data.pages.nodes} />
    </App>
  )
}

export default Index
export const Head = ({ pageContext, location }) => {
  const translationData = { currentLanguage: pageContext.language, currentSlug: location.pathname }
  const bodyStyles = {}
  return (
    <>
      <body style={bodyStyles} />
      <Meta title="CNTR Monitor" translationData={translationData} />
    </>
  )
}
