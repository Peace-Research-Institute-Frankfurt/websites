import React from 'react'
import Footer from './Footer'
import './global.scss'
import * as styles from './App.module.scss'

function App(props) {
  return (
    <>
      <div className={`${styles.container} ${props.className ? props.className : ''}`}>
        {props.children}
        <Footer />
      </div>
      <div id="tooltips" />
    </>
  )
}

export default App
