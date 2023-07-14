import React from 'react'
import Footer from './Footer'
import './global.scss'
import StickyHeader from './StickyHeader'

function App(props) {
  return (
    <>
      <StickyHeader />
      {props.children}
      <Footer />
    </>
  )
}

export default App
