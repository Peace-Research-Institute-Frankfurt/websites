import React from 'react'
import { MDXProvider } from '@mdx-js/react'

import Button from './ButtonAdapter'
import PrintFigure from './PrintFigure'
import Institution from './Institution'
import Resolution from './PrintResolution'
import Treaty from './Treaty'

const PostBody = ({ content, unit, site }) => {
  const shortCodes = {
    Embed: ({ src, caption }) => (
      <aside className="callout">
        View interactive component at{' '}
        <span className="url">
          {site.siteMetadata.siteUrl}
          {unit.childMdx.fields.slug}
        </span>
      </aside>
    ),
    EmbedChoices: () => <></>,
    Quiz: () => (
      <aside className="callout">
        View quiz at {` `}
        <span className="url">
          {site.siteMetadata.siteUrl}
          {unit.childMdx.fields.slug}
        </span>
      </aside>
    ),
    RadioChoice: () => <></>,
    Question: () => <></>,
    Choice: () => <></>,
    Resolution,
    Treaty,
    Institution,
    Tab: ({ title, children }) => (
      <li>
        <h3>{title}</h3>
        {children}
      </li>
    ),
    Tabs: ({ children }) => <ul className="tabs">{children}</ul>,
    Related: () => <></>,
    Quote: ({ children, cite }) => (
      <blockquote>
        {children}
        {cite && <cite>{cite}</cite>}
      </blockquote>
    ),
    Term: ({ t, children }) => <em>{t || children}</em>,
    Figure: ({ ...props }) => <PrintFigure {...props} />,
    LectureVideo: ({ children }) => <>{children}</>,
    Event: ({ date, title, children }) => (
      <li className="timelineEvent">
        <h4>
          <strong>{date}</strong> · {title}
        </h4>
        {children}
      </li>
    ),
    Timeline: ({ ...props }) => <ol className="timeline" {...props} />,
    FlipCards: ({ children }) => <ul>{children}</ul>,
    Card: ({ front, children }) => (
      <li>
        <strong>{front}</strong>
        {children}
      </li>
    ),
    Details: ({ summary, children }) => (
      <aside className="details">
        <h3>{summary}</h3>
        {children}
      </aside>
    ),
    DetailsGroup: ({ children }) => <>{children}</>,
    Callout: ({ ...props }) => <aside className="callout" {...props} />,
  }

  return <MDXProvider components={shortCodes}>{content}</MDXProvider>
}

export default PostBody
