import React from 'react'
import Footer from './Footer'

function App(props) {
  return (
    <>
      {props.children}
      <Footer />
    </>
  )
}

export default App
