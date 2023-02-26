import React from 'react'
import { Provider } from 'react-wrap-balancer'
import { EmbedChoicesProvider } from './src/context/EmbedChoicesContext'

const HtmlAttributes = {
  lang: 'en-EN',
}

export const onRenderBody = ({ setHtmlAttributes }) => {
  setHtmlAttributes(HtmlAttributes)
}

export const wrapRootElement = ({ element }) => {
  return (
    <EmbedChoicesProvider>
      <Provider>{element}</Provider>
    </EmbedChoicesProvider>
  )
}
