import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import LanguageSwitcher from './LanguageSwitcher'
import Footer from './Footer'
import SkipToContent from './SkipToContent'
import SiteHeader from './SiteHeader'
import './global.scss'
import useTranslations from '../hooks/useTranslations'

function App({ translationData, pages, issue, post, pagination, children }) {
  return (
    <>
      <SkipToContent />
      {children}
    </>
  )
}

export default App
