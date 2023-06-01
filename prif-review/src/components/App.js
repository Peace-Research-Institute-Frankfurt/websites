import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import LanguageSwitcher from './LanguageSwitcher'
import Footer from './Footer'
import SkipToContent from './SkipToContent'
import SiteHeader from './SiteHeader'
import './global.scss'
import useTranslations from '../hooks/useTranslations'

function App({ translationData, pages, children }) {
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
    <>
      <SkipToContent />
      <SiteHeader>
        <LanguageSwitcher translations={translations} translationData={translationData} />
      </SiteHeader>
      {children}
      <Footer pages={pages} language={translationData.currentLanguage} />
    </>
  )
}

export default App
