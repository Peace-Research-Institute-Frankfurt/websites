import { MDXProvider } from '@mdx-js/react'
import React from 'react'
import { Embed, Vimeo, Youtube } from './Embed'
import EmbedChoices from './EmbedChoices'
import Leadin from './Leadin'
import FileAdapter from './FileAdapter'
import FigureAdapter from './FigureAdapter'
import { Quote, Figure } from '@prif/shared'
import * as QuoteStyles from './Quote.module.scss'
import * as FileStyles from './File.module.scss'
import * as FigureStyles from './Figure.module.scss'

const shortCodes = {
  Figure: ({ ...props }) => <FigureAdapter {...props} styles={FigureStyles} />,
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
