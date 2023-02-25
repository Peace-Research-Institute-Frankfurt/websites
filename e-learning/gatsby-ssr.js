import React from 'react'
import { EmbedChoicesProvider } from './src/context/EmbedChoicesContext'

const HtmlAttributes = {
  lang: 'en-EN',
}

export const onRenderBody = ({ setHtmlAttributes }) => {
  setHtmlAttributes(HtmlAttributes)
}

export const wrapRootElement = ({ element }) => {
  return <EmbedChoicesProvider>{element}</EmbedChoicesProvider>
}
