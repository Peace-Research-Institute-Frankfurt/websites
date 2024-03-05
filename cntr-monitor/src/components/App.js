import React from 'react'
import SkipToContent from './SkipToContent'
import './global.scss'

function App({ children }) {
  return (
    <>
      <SkipToContent />
      {children}
    </>
  )
}

export default App
