import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import LanguageSwitcher from './LanguageSwitcher'
import Footer from './Footer'
import SkipToContent from './SkipToContent'
import SiteHeader from './SiteHeader'
import './global.scss'
import useTranslations from '../hooks/useTranslations'

function App({ translationData, pages, styles, report, children }) {
  const data = useStaticQuery(graphql`
    query {
      allSitePage {
        nodes {
          path
          pageContext
        }
      }
    }
  `)

  let translations = useTranslations(translationData, data.allSitePage.nodes)

  return (
    <div style={styles ? styles : {}}>
      <SkipToContent />
      <SiteHeader report={report} translationData={translationData}>
        {translations.length > 0 && <LanguageSwitcher translations={translations} translationData={translationData} />}
      </SiteHeader>
      {children}
      <Footer pages={pages} language={translationData.currentLanguage} />
    </div>
  )
}

export default App
