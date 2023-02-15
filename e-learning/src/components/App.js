import React from 'react'
import SiteFooter from './SiteFooter'
import './global.scss'

function App(props) {
  return (
    <>
      <main className="site__content">{props.children}</main>
      <SiteFooter />
    </>
  )
}

export default App
