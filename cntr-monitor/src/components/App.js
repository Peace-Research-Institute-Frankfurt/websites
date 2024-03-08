import React from 'react'
import SkipToContent from './SkipToContent'
import './global.scss'
import * as styles from './App.module.scss'

function App({ children }) {
  return (
    <div className={styles.container}>
      <SkipToContent />
      {children}
      <div id="tooltips" />
    </div>
  )
}

export default App
