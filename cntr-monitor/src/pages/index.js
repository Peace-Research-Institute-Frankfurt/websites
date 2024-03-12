import { graphql } from 'gatsby'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import { Link, useTranslation } from 'gatsby-plugin-react-i18next'
import React from 'react'
import MarkdownRenderer from 'react-markdown-renderer'
import AboutSection from '../components/AboutSection'
import App from '../components/App'
import Footer from '../components/Footer'
import LanguageSwitcher from '../components/LanguageSwitcher'
import Meta from '../components/Meta'
import SiteHeader from '../components/SiteHeader'
import useColors from '../hooks/useColors'
import useTranslations from '../hooks/useTranslations'
import * as styles from './index.module.scss'
import PartnerLogos from '../components/PartnerLogos'

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
        base
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
            download_url
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
  const { primary, dark, light, knockout } = useColors(currentIssue.childMdx.frontmatter.color)
  const currentStyles = {
    '--fc-primary': primary.toString(),
    '--fc-dark': dark.toString(),
    '--fc-light': light.toString(),
    '--fc-knockout': knockout.toString(),
  }

  return (
    <App pages={data.pages.nodes}>
      <SiteHeader pages={data.pages.nodes} color="white" translationData={translationData}>
        <LanguageSwitcher translations={translations} translationData={translationData} />
      </SiteHeader>

      <main>
        <section className={styles.hero}>
          <div className={styles.heroBlue} />
          <div className={styles.heroBlack} />
          <h1 className={styles.heroTitle}>
            <span className={styles.cntr}>CNTR</span>
            <span className={styles.monitor}>Monitor</span>
          </h1>
          <p className={styles.heroIntro}>{t(`index.header.intro`)}</p>
        </section>
        <section className={styles.current} style={currentStyles}>
          <div className={styles.currentInner}>
            <GatsbyImage alt="" image={currentImage} className={styles.currentImage} />
            <div className={styles.currentIssue}>
              <Link className={styles.currentTitle} to={`/${currentYear}`}>
                <h2>{currentYear}</h2>
              </Link>
              <div className={styles.currentIntro}>
                <MarkdownRenderer markdown={currentIssue.childMdx.frontmatter.intro} />
                <div className={styles.currentLinks}>
                  <Link className={styles.currentRead} to={`/${currentYear}`}>
                    {t('Read online')}
                  </Link>
                  {currentIssue.childMdx.frontmatter.download_url && <a href={currentIssue.childMdx.frontmatter.download_url}>{t('Download PDF')}</a>}
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className={styles.body}>
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
          <section>
            <AboutSection />
            <PartnerLogos />
          </section>
        </section>
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
