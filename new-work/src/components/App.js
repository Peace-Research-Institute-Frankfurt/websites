import React from 'react'
import Footer from './Footer'
import './global.scss'
import * as styles from './App.module.scss'
import StickyHeader from './StickyHeader'

function App(props) {
  return (
    <div className={`${styles.container} ${props.className ? props.className : ''}`}>
      <StickyHeader />
      {props.children}
      <Footer />
    </div>
  )
}

export default App
