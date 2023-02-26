import React from 'react'
import { Provider } from 'react-wrap-balancer'
import { EmbedChoicesProvider } from './src/context/EmbedChoicesContext'

export const wrapRootElement = ({ element }) => {
  return (
    <EmbedChoicesProvider>
      <Provider>{element}</Provider>
    </EmbedChoicesProvider>
  )
}
