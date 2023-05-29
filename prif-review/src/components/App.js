import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import LanguageSwitcher from './LanguageSwitcher'
import Footer from './Footer'
import { useI18next } from 'gatsby-plugin-react-i18next'
import SkipToContent from './SkipToContent'
import SiteHeader from './SiteHeader'
import './global.scss'

function removeLanguagePrefix(s){
  // Hard-coding this for English until I come up with a working regex
  return s.replace("/en", "")
}

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
    
  // This array will hold data about translations of the current page,
  // including accurate paths, and excluding the current language.
  
  let translations = []
  const languages = ["de", "en"]
  const targetLanguages = languages.filter(el => el !== translationData.currentLanguage)
  const basePath = removeLanguagePrefix(translationData.currentSlug)
  
  if (translationData.translations){
    translations = translationData.translations.map(t => {
     const translationPage = data.allSitePage.nodes.find(el => el.pageContext.id === t.id)
     return {path: translationPage.path, language: translationPage.pageContext.language}
    })
  } else {
    translations = targetLanguages.map(l => {
      const translationPage = data.allSitePage.nodes.find(el => {
        const p = removeLanguagePrefix(el.path)
        return el.pageContext.language === l && p === basePath
      })
      return {path: translationPage.path, language: l}
    })
  }

  return (
    <>
      <SkipToContent />
      <SiteHeader>
        <p>Current path: {translationData.currentSlug}</p>
        <p>Current path w/o language prefix: {basePath}</p>
        <LanguageSwitcher translations={translations} translationData={translationData} />
      </SiteHeader>
      {children}
      <Footer pages={pages} language={translationData.currentLanguage} />
    </>
  )
}

export default App
