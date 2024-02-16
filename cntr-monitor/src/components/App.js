import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import LanguageSwitcher from './LanguageSwitcher'
import Footer from './Footer'
import SkipToContent from './SkipToContent'
import SiteHeader from './SiteHeader'
import './global.scss'
import useTranslations from '../hooks/useTranslations'

function App({ translationData, pages, issue, post, pagination, children }) {
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
      <SiteHeader post={post} translationData={translationData}>
        {pagination && pagination}
        {translations.length > 0 && <LanguageSwitcher translations={translations} translationData={translationData} />}
      </SiteHeader>
      {children}
      <Footer pages={pages} language={translationData.currentLanguage} />
    </>
  )
}

export default App
