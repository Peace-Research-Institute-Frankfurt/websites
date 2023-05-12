import React from 'react'
import LanguageSwitcher from './LanguageSwitcher'
import Footer from './Footer'

function App({ translations, pages, children }) {
  return (
    <>
      <LanguageSwitcher translations={translations} />
      {children}
      <Footer pages={pages} />
    </>
  )
}

export default App
