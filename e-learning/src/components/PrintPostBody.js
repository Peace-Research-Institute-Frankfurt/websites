import React from 'react'
import { MDXProvider } from '@mdx-js/react'

import Button from './ButtonAdapter'
import FigureAdapter from './FigureAdapter'
import Institution from './Institution'
import QuoteAdapter from './QuoteAdapter'
import Resolution from './Resolution'
import { Tab, Tabs } from './TabsAdapter'
import Treaty from './Treaty'
import Related from './Related'
import Callout from '@shared/components/Callout'
import { Event, Timeline } from '@shared/components/Timeline'

import * as CalloutStyles from './Callout.module.scss'
import * as FigureStyles from './Figure.module.scss'
import * as QuoteStyles from './Quote.module.scss'
import * as TimelineStyles from './Timeline.module.scss'

const shortCodes = {
  Embed: () => <>EMBED HERE</>,
  EmbedChoices: () => <></>,
  Quiz: () => <>QUIZ HERE</>,
  RadioChoice: () => <></>,
  Question: () => <></>,
  Choice: () => <></>,
  Resolution,
  Treaty,
  Institution,
  Tab,
  Tabs,
  Related,
  Quote: ({ children, cite }) => (
    <blockquote>
      {children}
      <cite>{cite}</cite>
    </blockquote>
  ),
  Term: ({ t, children }) => <em>{t || children}</em>,
  Figure: ({ ...props }) => <FigureAdapter styles={FigureStyles} {...props} />,
  LectureVideo: ({ children }) => <aside>{children}</aside>,
  Event: ({ ...props }) => <Event styles={TimelineStyles} {...props} />,
  Timeline: ({ ...props }) => <Timeline styles={TimelineStyles} {...props} />,
  FlipCards: ({ children }) => <ul>{children}</ul>,
  Card: ({ front, children }) => (
    <li>
      <em>{front}</em>
      {children}
    </li>
  ),
  Details: ({ summary, children }) => (
    <aside>
      <h3>{summary} </h3>
      {children}
    </aside>
  ),
  DetailsGroup: ({ children }) => <>{children}</>,
  Callout: ({ ...props }) => <Callout {...props} buttonComponent={Button} styles={CalloutStyles} />,
}

const PostBody = ({ content }) => {
  return <MDXProvider components={shortCodes}>{content}</MDXProvider>
}

export default PostBody
