import React from 'react'
import SiteFooter from './SiteFooter'
import './global.scss'
import * as styles from './App.module.scss'

function App(props) {
  return (
    <>
      <a href="#content" className={styles.skip}>
        Skip to content
      </a>
      <main>{props.children}</main>
      <SiteFooter />
      <div id="tooltips" />
    </>
  )
}

export default App
