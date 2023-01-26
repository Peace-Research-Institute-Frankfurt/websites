import React from 'react'
import Footer from './Footer'
import './global.scss'

function App(props) {
  return (
    <>
      {props.children}
      <Footer />
    </>
  )
}

export default App
