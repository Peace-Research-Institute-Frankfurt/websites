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
          intro="Die Jahresberichte des Peace Research Institute Frankfurt geben Auskunft über alle relevanten Ergebnisse aus Forschung und Wissens­transfer."
        />
        <section className={styles.body}>
          <p>
            Der ausführliche Daten- und Faktenteil listet alle Publikationen, organisierte Konferenzen und Panels, Vorträge, Auszeichnungen,
            Lehrveran­staltungen, Gremien­tätigkeiten und vieles mehr der Wissen­schaft­lerinnen und Wissenschaftler eines Jahres auf. Der
            redaktionelle Teil stellt Highlights aus den Programm­bereichen und Forschungs­gruppen wie Projekt­abschlüsse, inter­nationale Konferenzen
            und Transfer­projekte vor.
          </p>
          <ol className={styles.reports}>
            <li className={styles.reportLabels}>
              <span className={styles.reportYear}>{t('Year')}</span>
              <span>{t('Published on')}</span>
            </li>
            {data.reports.nodes.map((report, i) => {
              const year = report.relativeDirectory.replace(/(.{2})\/(reports)\//g, '')
              return (
                <li key={`report-${i}`}>
                  <Link className={styles.report} to={`/${year}`}>
                    <span className={styles.reportYear}>{year}</span>
                    <span>23 Juni, 2023</span>
                  </Link>
                </li>
              )
            })}
          </ol>
          <div className={styles.notes}>
            <MarkdownRenderer
              markdown={t('Annual reports from 2009 through 2021 can be found [on our website.](https://www.hsfk.de/en/about-us/annual-reports/)')}
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
  return <Meta translationData={translationData} />
}
