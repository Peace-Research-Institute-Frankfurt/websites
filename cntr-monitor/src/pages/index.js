import React from 'react'
import { graphql } from 'gatsby'
import App from '../components/App'
import Meta from '../components/Meta'
import SkipToContent from '../components/SkipToContent'
import { Link, useTranslation } from 'gatsby-plugin-react-i18next'
import * as styles from './index.module.scss'
import SiteHeader from '../components/SiteHeader'
import Chevron from '../images/chevron.svg'
import Footer from '../components/Footer'

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
          }
        }
      }
    }
  }
`

const Index = ({ data, pageContext, location }) => {
  const { t } = useTranslation()
  const translationData = { currentLanguage: pageContext.language, currentSlug: location.pathname }

  return (
    <App pages={data.pages.nodes}>
      <SkipToContent />

      <SiteHeader post={data.post} translationData={translationData}></SiteHeader>

      <main className={styles.container}>
        <section className={styles.hero}>
          <div className={styles.headerBlue}>
            <Chevron />
          </div>
          <div className={styles.headerBlack}>
            <Chevron />
          </div>
          <h1 className={styles.heroTitle}>CNTR Monitor</h1>
          <p className={styles.heroIntro}>
            {t(
              `The CNTR Monitor is an open-access publication on trends on technology and arms control and the core product of CNTR's research. In addition to analyses of individual technologies and reports on Research & Development (R&D) activities, the CNTR Monitor highlights opportunities for political control and capacities in selected regions.`
            )}
          </p>
        </section>
        <section className={styles.current}>
          <div className={styles.currentInner}>
            <div className={styles.currentImage}>
              <Chevron />
            </div>
            <h2 className={styles.sectionTitle}>Current issue</h2>
            <div className={styles.currentIssue}>
              <h2>2024</h2>
              <p>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Similique voluptatem illum facere. Accusamus delectus unde vel sed pariatur
                sunt, ex dolore consequatur suscipit fuga alias voluptatibus, voluptas quia porro voluptates voluptatum tempore! Mollitia incidunt
                maiores enim sed quia fugit atque?
              </p>
            </div>
          </div>
          <div className={styles.currentBrand}>
            <Chevron />
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
      <Footer />
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
