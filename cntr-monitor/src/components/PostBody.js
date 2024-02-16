import { MDXProvider } from '@mdx-js/react'
import React from 'react'

const shortCodes = {}

export default function PostBody({ children }) {
  return (
    <section>
      <MDXProvider components={shortCodes}>{children}</MDXProvider>
    </section>
  )
}
