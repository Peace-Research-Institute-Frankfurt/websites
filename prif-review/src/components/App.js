import React from 'react'
import LanguageSwitcher from './LanguageSwitcher'
import Footer from './Footer'

function App(props) {
  return (
    <>
      <LanguageSwitcher />
      {props.children}
      <Footer />
    </>
  )
}

export default App
