import React from 'react'
import { EmbedChoicesProvider } from './src/context/EmbedChoicesContext'
import { Provider } from 'react-wrap-balancer'

const HtmlAttributes = {
  lang: 'de-DE',
}

export const onRenderBody = ({ setHtmlAttributes, setHeadComponents, setPostBodyComponents }, pluginOptions) => {
  setHtmlAttributes(HtmlAttributes)
  setHeadComponents([<link rel="preconnect" href="https://use.typekit.net" crossOrigin="true" key="typekit-preconnect" />])

  // We're injecting the Typekit CSS at the bottom of the <body> because
  // the usual pattern (https://web.dev/defer-non-critical-css/) doesn't work.
  setPostBodyComponents([<link key="typekit" rel="stylesheet" href="https://use.typekit.net/brb1src.css" />])
}

export const wrapRootElement = ({ element }) => {
  return (
    <EmbedChoicesProvider>
      <Provider>{element}</Provider>
    </EmbedChoicesProvider>
  )
}
