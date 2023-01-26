import React from 'react'
import './global.scss'

function App(props) {
  return (
    <>
      <main className="site__content">{props.children}</main>
    </>
  )
}

export default App
