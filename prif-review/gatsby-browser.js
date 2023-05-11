import React from 'react'
import { EmbedChoicesProvider } from './src/context/EmbedChoicesContext'
import { Provider } from 'react-wrap-balancer'

export const wrapRootElement = ({ element }) => {
  return (
    <EmbedChoicesProvider>
      <Provider>{element}</Provider>
    </EmbedChoicesProvider>
  )
}
