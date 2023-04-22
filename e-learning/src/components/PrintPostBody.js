import React from 'react'
import { MDXProvider } from '@mdx-js/react'

import Button from './ButtonAdapter'
import PrintFigure from './PrintFigure'
import Institution from './Institution'
import Resolution from './Resolution'
import Treaty from './Treaty'
import Callout from '@shared/components/Callout'

import * as CalloutStyles from './Callout.module.scss'

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
  Tab: () => <>TAB</>,
  Tabs: () => <>TABS</>,
  Related: () => <></>,
  Quote: ({ children, cite }) => (
    <blockquote>
      {children}
      <cite>{cite}</cite>
    </blockquote>
  ),
  Term: ({ t, children }) => <em>{t || children}</em>,
  Figure: ({ ...props }) => <PrintFigure {...props} />,
  LectureVideo: ({ children }) => <aside>{children}</aside>,
  Event: ({ date, title, children }) => (
    <li className="timelineEvent">
      <h4>
        {date} {title}
      </h4>
      {children}
    </li>
  ),
  Timeline: ({ ...props }) => <ol className="timeline" {...props} />,
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
