import React from 'react'
import LanguageSwitcher from './LanguageSwitcher'
import Footer from './Footer'
import { useI18next } from 'gatsby-plugin-react-i18next'
import SkipToContent from './SkipToContent'
import SiteHeader from './SiteHeader'
import './global.scss'

function App({ translationData, pages, children }) {
  const { defaultLanguage } = useI18next()

  return (
    <>
      <SkipToContent />
      <SiteHeader>
        <LanguageSwitcher translationData={translationData} />
      </SiteHeader>
      <p>Default language: {JSON.stringify(defaultLanguage)}</p>
      {children}
      <Footer pages={pages} language={translationData.currentLanguage} />
    </>
  )
}

export default App
