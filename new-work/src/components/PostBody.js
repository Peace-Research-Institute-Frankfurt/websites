import { MDXProvider } from '@mdx-js/react'
import React from 'react'
import { Embed, Vimeo, Youtube } from './Embed'
import EmbedChoices from './EmbedChoices'
import Figure from './Figure'
import File from './File'
import Leadin from './Leadin'
import { Quote } from '@prif/shared'
import * as QuoteStyles from './Quote.module.scss'

const shortCodes = {
  Figure,
  Quote: ({ ...props }) => <Quote {...props} styles={QuoteStyles} />,
  File,
  Leadin,
  Vimeo,
  Youtube,
  EmbedChoices,
  Embed,
}

export default function PostBody({ children }) {
  return <MDXProvider components={shortCodes}>{children}</MDXProvider>
}
