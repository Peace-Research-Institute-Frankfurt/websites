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
import AboutSection from '../components/AboutSection'
import { getImage, GatsbyImage } from 'gatsby-plugin-image'
import useColors from '../hooks/useColors'
import useTranslations from '../hooks/useTranslations'
import LanguageSwitcher from '../components/LanguageSwitcher'

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
            color
            cover_image {
              childImageSharp {
                gatsbyImageData(width: 1200, layout: FULL_WIDTH, placeholder: BLURRED)
              }
            }
          }
        }
      }
    }
    allSitePage {
      nodes {
        path
        pageContext
      }
    }
  }
`

const Index = ({ data, pageContext, location }) => {
  const { t } = useTranslation()
  const translationData = { currentLanguage: pageContext.language, currentSlug: location.pathname }
  const translations = useTranslations(translationData, data.allSitePage.nodes)

  const pastIssues = data.issues.nodes.slice(1)
  const currentIssue = data.issues.nodes[0]
  const currentYear = currentIssue.relativeDirectory.replace(/(.{2})\/(issues)\//g, '')
  const currentImage = getImage(currentIssue.childMdx.frontmatter.cover_image)
  const { primary, dark, knockout } = useColors(currentIssue.childMdx.frontmatter.color)
  const currentStyles = {
    '--fc-primary': primary.toString(),
    '--fc-dark': dark.toString(),
    '--fc-knockout': knockout.toString(),
  }
  return (
    <App pages={data.pages.nodes}>
      <SkipToContent />

      <SiteHeader color="white" translationData={translationData}>
        <LanguageSwitcher translations={translations} translationData={translationData} />
      </SiteHeader>

      <main className={styles.container}>
        <section className={styles.hero}>
          <div className={styles.heroBlue} />
          <div className={styles.heroBlack} />
          <h1 className={styles.heroTitle}>CNTR Monitor</h1>
          <p className={styles.heroIntro}>{t(`index.header.intro`)}</p>
        </section>
        <section className={styles.current} style={currentStyles}>
          <div className={styles.currentInner}>
            <GatsbyImage alt="" image={currentImage} className={styles.currentImage} />
            <h2 className={styles.sectionTitle}>{t('Current issue')}</h2>
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
        {pastIssues.length > 0 && (
          <section className={styles.archive}>
            <h2 className={styles.sectionTitle}>{t('Past issues')}</h2>
            <ol className={styles.archiveList}>
              {pastIssues.map((node, i) => {
                const year = node.relativeDirectory.replace(/(.{2})\/(issues)\//g, '')
                return (
                  <li key={`issue-${i}`} className={styles.archiveItem}>
                    <Link to={`/${year}`}>
                      <span className={styles.archiveTitle}>{year}</span>
                      <div className={styles.archiveIntro}>
                        <MarkdownRenderer markdown={currentIssue.childMdx.frontmatter.intro} />
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ol>
          </section>
        )}
        <AboutSection />
      </main>
      <Footer pages={data.pages.nodes} />
    </App>
  )
}

export default Index
export const Head = ({ pageContext, location }) => {
  const translationData = { currentLanguage: pageContext.language, currentSlug: location.pathname }

  return (
    <>
      <body />
      <Meta title="CNTR Monitor" translationData={translationData} />
    </>
  )
}
