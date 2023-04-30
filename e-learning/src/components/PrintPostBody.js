import React, { useState } from 'react'
import { MDXProvider } from '@mdx-js/react'

import Figure from './PrintFigure'
import Institution from './PrintInstitution'
import Resolution from './PrintResolution'
import Treaty from './PrintTreaty'
import PrintTerm from './PrintTerm'
import PrintChapter from './PrintChapter'
import ColumnBreak from './ColumnBreak'

const PostBody = ({ content, unit, site, setChapterList }) => {
  const [terms, setTerms] = useState([])

  const addTerm = function (newTerm) {
    if (terms.findIndex((el) => el.term_id === newTerm.term_id) === -1) setTerms([...terms, newTerm])
  }

  const shortCodes = {
    a: ({ href, children }) => {
      return (
        <a href={href}>
          {children !== href && <>{children}</>} <span className="url">[{href}]</span>
        </a>
      )
    },
    Embed: () => (
      <aside className="callout">
        <svg preserveAspectRatio="none" className="asideBackdrop" width={100} height={100} viewBox="0 0 100 100">
          <rect x={0} y={0} width={100} height={100} />
        </svg>
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
        <svg preserveAspectRatio="none" className="asideBackdrop" width={100} height={100} viewBox="0 0 100 100">
          <rect x={0} y={0} width={100} height={100} />
        </svg>
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
    Term: ({ t, children }) => (
      <PrintTerm t={t} addTerm={addTerm}>
        {children}
      </PrintTerm>
    ),
    Figure,
    LectureVideo: ({ children }) => <>{children}</>,
    Event: ({ date, title, children }) => (
      <li className="timelineEvent">
        <h3>
          <strong>{date}</strong> · {title}
        </h3>
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
    ColumnBreak,
    DetailsGroup: ({ children }) => <>{children}</>,
    Callout: ({ ...props }) => <aside className="callout" {...props} />,
    Chapter: ({ ...props }) => <PrintChapter setChapterList={setChapterList} {...props} />,
  }

  return (
    <>
      <MDXProvider components={shortCodes}>
        {content}
        {terms.length > 0 && (
          <section className="termsContainer">
            <h2>Terms</h2>
            <dl className="terms">
              {terms.map((t, i) => {
                return (
                  <div className="term" key={`term.${i}`}>
                    <dt>{t.title}</dt>
                    <dd>{t.description}</dd>
                  </div>
                )
              })}
            </dl>
          </section>
        )}
      </MDXProvider>
    </>
  )
}

export default PostBody
