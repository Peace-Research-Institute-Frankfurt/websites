import React from 'react'
import { EmbedChoicesProvider } from './src/context/EmbedChoicesContext'

export const wrapRootElement = ({ element }) => {
  return <EmbedChoicesProvider>{element}</EmbedChoicesProvider>
}
