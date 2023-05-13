import { MDXProvider } from '@mdx-js/react'
import React from 'react'
import Figure from './FigureAdapter'

const shortCodes = {
  Figure,
}

export default function PostBody({ children }) {
  return <MDXProvider components={shortCodes}>{children}</MDXProvider>
}
