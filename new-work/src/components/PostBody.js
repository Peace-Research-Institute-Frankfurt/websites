import { MDXProvider } from '@mdx-js/react'
import React from 'react'
import { Embed, Vimeo, Youtube } from './Embed'
import EmbedChoices from './EmbedChoices'
import Figure from './Figure'
import Leadin from './Leadin'
import FileAdapter from './FileAdapter'
import { Quote } from '@prif/shared'
import * as QuoteStyles from './Quote.module.scss'
import * as FileStyles from './File.module.scss'

const shortCodes = {
  Figure,
  Quote: ({ ...props }) => <Quote {...props} styles={QuoteStyles} />,
  File: ({ ...props }) => <FileAdapter {...props} styles={FileStyles} />,
  Leadin,
  Vimeo,
  Youtube,
  EmbedChoices,
  Embed,
}

export default function PostBody({ children }) {
  return <MDXProvider components={shortCodes}>{children}</MDXProvider>
}
