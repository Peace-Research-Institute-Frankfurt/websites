import { MDXProvider } from '@mdx-js/react'
import React from 'react'
import EmbedChoices from './EmbedChoices'
import Leadin from './Leadin'
import FileAdapter from './FileAdapter'
import FigureAdapter from './FigureAdapter'
import { EmbedAdapter, Youtube, Vimeo } from './EmbedAdapter'
import { Quote } from '@prif/shared'
import * as QuoteStyles from './Quote.module.scss'
import * as FileStyles from './File.module.scss'
import * as FigureStyles from './Figure.module.scss'
import * as EmbedStyles from './Embed.module.scss'

const shortCodes = {
  Figure: ({ ...props }) => <FigureAdapter {...props} styles={FigureStyles} />,
  Quote: ({ ...props }) => <Quote {...props} styles={QuoteStyles} />,
  File: ({ ...props }) => <FileAdapter {...props} styles={FileStyles} />,
  Youtube: ({ ...props }) => <Youtube styles={EmbedStyles} {...props} />,
  Vimeo: ({ ...props }) => <Vimeo styles={EmbedStyles} {...props} />,
  Leadin,
  EmbedChoices,
  Embed: ({ ...props }) => <EmbedAdapter styles={EmbedStyles} {...props} />,
}

export default function PostBody({ children }) {
  return <MDXProvider components={shortCodes}>{children}</MDXProvider>
}
