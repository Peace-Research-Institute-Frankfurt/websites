import { MDXProvider } from '@mdx-js/react'
import React from 'react'
import EmbedChoicesAdapter from './EmbedChoicesAdapter'
import Leadin from './Leadin'
import FileAdapter from './FileAdapter'
import FigureAdapter from './FigureAdapter'
import { EmbedAdapter, Youtube, Vimeo } from './EmbedAdapter'
import TermAdapter from './TermAdapter'
import Quote from '@shared/components/Quote'

import * as TermStyles from './Term.module.scss'
import * as QuoteStyles from './Quote.module.scss'
import * as FileStyles from './File.module.scss'
import * as FigureStyles from './Figure.module.scss'
import * as EmbedStyles from './Embed.module.scss'
import * as EmbedChoicesStyles from './EmbedChoices.module.scss'

const shortCodes = {
  Figure: ({ ...props }) => <FigureAdapter {...props} styles={FigureStyles} />,
  Quote: ({ ...props }) => <Quote {...props} styles={QuoteStyles} />,
  File: ({ ...props }) => <FileAdapter {...props} styles={FileStyles} />,
  Youtube: ({ ...props }) => <Youtube styles={EmbedStyles} {...props} />,
  Vimeo: ({ ...props }) => <Vimeo styles={EmbedStyles} {...props} />,
  EmbedChoices: ({ ...props }) => <EmbedChoicesAdapter styles={EmbedChoicesStyles} />,
  Embed: ({ ...props }) => <EmbedAdapter styles={EmbedStyles} {...props} />,
  Term: ({ ...props }) => <TermAdapter styles={TermStyles} {...props} />,
  Leadin,
}

export default function PostBody({ children }) {
  return <MDXProvider components={shortCodes}>{children}</MDXProvider>
}
