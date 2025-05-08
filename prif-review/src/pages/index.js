import React from 'react'
import { graphql } from 'gatsby'
import App from '../components/App'
import Meta from '../components/Meta'
import SkipToContent from '../components/SkipToContent'
import PostHeader from '../components/PostHeader'
import MarkdownRenderer from 'react-markdown-renderer'
import { Link, useTranslation } from 'gatsby-plugin-react-i18next'
import * as styles from './index.module.scss'

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
    reports: allFile(
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
            publication_date
          }
        }
      }
    }
  }
`

const Index = ({ data, pageContext, location }) => {
  const { t } = useTranslation()
  return (
    <App pages={data.pages.nodes} translationData={{ currentLanguage: pageContext.language, currentSlug: location.pathname }}>
      <SkipToContent />
      <main className={styles.container}>
        <PostHeader
          title={t('PRIF Review')}
          intro="Die Jahresberichte des Peace Research Institute Frankfurt geben Auskunft über relevante Ergebnisse aus Forschung und Wissens­transfer."
        />
        <section className={styles.body}>
          <p>
          Die PRIF Jahresberichte präsentieren Einblicke in die Ergebnisse aus unserer Forschung und der Wissenschaftskommunikation des vergangenen Jahres. Die redaktionellen Artikel thematisieren verschiedene Forschungsthemen, stellen neue Projekte vor und präsentieren die Ergebnisse abgeschlossener Projekte. Die Beiträge werden ergänzt durch einen Jahresrückblick über Publikationen, Medienarbeit und weitere Zahlen und Fakten zum Institut.
          </p>
          <ol className={styles.reports}>
            <li className={styles.reportLabels}>
              <span className={styles.reportYear}>{t('Reporting Period')}</span>
              <span>{t('Published on')}</span>
            </li>
            {data.reports.nodes.map((report, i) => {
              const year = report.relativeDirectory.replace(/(.{2})\/(reports)\//g, '')
              return (
                <li key={`report-${i}`}>
                  <Link className={styles.report} to={`/${year}`}>
                    <span className={styles.reportYear}>{year}</span>
                    <span>{report.childMdx.frontmatter.publication_date}</span>
                  </Link>
                </li>
              )
            })}
          </ol>
          <div className={styles.notes}>
            <MarkdownRenderer
              markdown={t('Annual reports from 2009 through 2021 can be found [on our website.](https://www.prif.org/en/about-us/history-and-annual-review)')}
            />
          </div>
        </section>
      </main>
    </App>
  )
}

export default Index
export const Head = ({ pageContext, location }) => {
  const translationData = { currentLanguage: pageContext.language, currentSlug: location.pathname }
  const bodyStyles = {
    '--fc-text': 'hsl(207, 49%, 26%)',
    '--fc-background': 'hsl(200, 0%, 99%)',
    '--logo-primary': 'var(--prif-blue-dark)',
    '--logo-secondary': 'var(--prif-blue-light)',
  }
  return (
    <>
      <body style={bodyStyles} />
      <Meta title="PRIF Review" translationData={translationData} />
    </>
  )
}
