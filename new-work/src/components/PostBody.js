import { MDXProvider } from '@mdx-js/react'
import React from 'react'
import EmbedChoicesAdapter from './EmbedChoicesAdapter'
import Leadin from './Leadin'
import { FileAdapter, FileList } from './FileAdapter'
import FigureAdapter from './FigureAdapter'
import { EmbedAdapter, Youtube, Vimeo } from './EmbedAdapter'
import TermAdapter from './TermAdapter'
import { Interview, InterviewQuestion } from '@shared/components/Interview'
import Quote from '@shared/components/Quote'
import { Tab, Tabs } from './TabsAdapter'
import Callout from '@shared/components/Callout'
import Button from './ButtonAdapter'
import { Listicle, ListicleItem } from './Listicle'

import * as QuoteStyles from './Quote.module.scss'
import * as CalloutStyles from './Callout.module.scss'
import * as FigureStyles from './Figure.module.scss'
import * as EmbedStyles from './Embed.module.scss'
import * as EmbedChoicesStyles from './EmbedChoices.module.scss'
import * as InterviewStyles from './Interview.module.scss'
import * as styles from './PostBody.module.scss'

const shortCodes = {
  Figure: ({ ...props }) => <FigureAdapter {...props} styles={FigureStyles} />,
  Quote: ({ ...props }) => <Quote {...props} styles={QuoteStyles} />,
  File: ({ ...props }) => <FileAdapter {...props} />,
  Youtube: ({ ...props }) => <Youtube styles={EmbedStyles} {...props} />,
  Vimeo: ({ ...props }) => <Vimeo styles={EmbedStyles} {...props} />,
  EmbedChoices: ({ ...props }) => <EmbedChoicesAdapter styles={EmbedChoicesStyles} />,
  Embed: ({ ...props }) => <EmbedAdapter styles={EmbedStyles} {...props} />,
  Term: ({ ...props }) => <TermAdapter {...props} />,
  Interview: ({ ...props }) => <Interview styles={InterviewStyles} {...props} />,
  InterviewQuestion: ({ ...props }) => <InterviewQuestion styles={InterviewStyles} {...props} />,
  Callout: ({ ...props }) => <Callout expandable={false} buttonComponent={Button} styles={CalloutStyles} {...props} />,
  Tab,
  Tabs,
  Leadin,
  FileList,
  Listicle,
  ListicleItem,
}

export default function PostBody({ children }) {
  return (
    <div className={styles.container}>
      <MDXProvider components={shortCodes}>{children}</MDXProvider>
    </div>
  )
}
