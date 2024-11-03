import { MDXProvider } from '@mdx-js/react'
import React from 'react'
import slug from 'slug'

import EmbedChoicesAdapter from './EmbedChoicesAdapter'
import Leadin from './Leadin'
import { FileAdapter, FileList } from './FileAdapter'
import FigureAdapter from './FigureAdapter'
import { EmbedAdapter, Youtube, Vimeo } from './EmbedAdapter'
import TermAdapter from './TermAdapter'
import { Interview, InterviewQuestion } from '@shared/components/Interview'
import Quote from '@shared/components/Quote'
import IconTile from './IconTile'
import { Tab, Tabs } from './TabsAdapter'
import Callout from '@shared/components/Callout'
import Button from './ButtonAdapter'
import { Details, DetailsGroup } from '@shared/components/Details'
import { Listicle, ListicleItem } from './Listicle'
import ImageSlider from './ImageSlider'
import Note from './Note'
import { BubbleQuotes, BubbleQuote } from './BubbleQuote'
import { ManifestoSignatory, ManifestoSignatories, ManifestoList, ManifestoListItem } from './Manifesto'
import { BookReview, BookReviewList } from './BookReview'
import Schedule from './Schedule'
import PlaceholderText from './PlaceholderText'
import * as QuoteStyles from './Quote.module.scss'
import * as CalloutStyles from './Callout.module.scss'
import * as FigureStyles from './Figure.module.scss'
import * as EmbedStyles from './Embed.module.scss'
import * as EmbedChoicesStyles from './EmbedChoices.module.scss'
import * as InterviewStyles from './Interview.module.scss'
import * as DetailsStyles from './Details.module.scss'
import * as styles from './PostBody.module.scss'
import DateChip from './DateChip'
import IconGrid from './IconGrid'

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
  Details: ({ ...props }) => <Details {...props} styles={DetailsStyles} />,
  DetailsGroup: ({ ...props }) => <DetailsGroup {...props} styles={DetailsStyles} />,
  NoBreak: ({ ...props }) => <span {...props} className={styles.noBreak} />,
  Aside: ({ children }) => (
    <aside className={styles.aside}>
      <div className={styles.asideInner}>{children}</div>
    </aside>
  ),
  Keep: ({ children }) => <span class={styles.noBreak}>{children}</span>,
  Tab,
  Tabs,
  Leadin,
  FileList,
  Listicle,
  ListicleItem,
  BubbleQuotes,
  BubbleQuote,
  ImageSlider,
  Note,
  ManifestoSignatories,
  ManifestoSignatory,
  ManifestoList,
  ManifestoListItem,
  BookReview,
  BookReviewList,
  PlaceholderText,
  IconTile,
  Schedule,
  DateChip,
  IconGrid,
  h2: ({ children }) => <h2 id={slug(children)}>{children}</h2>,
  h3: ({ children }) => <h3 id={slug(children)}>{children}</h3>,
}

export default function PostBody({ children }) {
  return (
    <div className={styles.container}>
      <MDXProvider components={shortCodes}>{children}</MDXProvider>
    </div>
  )
}
