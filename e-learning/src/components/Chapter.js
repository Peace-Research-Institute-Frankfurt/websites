import { MDXProvider } from '@mdx-js/react'
import { Callout, Card, Details, DetailsGroup, Event, FlipCards, Timeline } from '@prif/shared'
import { graphql, Link } from 'gatsby'
import { getSrc } from 'gatsby-plugin-image'
import React from 'react'
import App from './App'
import Button from './Button'
import { Embed } from './Embed'
import FigureAdapter from './FigureAdapter'
import Institution from './Institution'
import LectureVideo from './LectureVideo'
import Map from './Map'
import Meta from './Meta'
import { Choice } from './MultipleChoice'
import { Question, Quiz, RadioChoice } from './Quiz.js'
import QuoteAdapter from './QuoteAdapter'
import Resolution from './Resolution'
import StickyHeader from './StickyHeader'
import TableOfContents from './TableOfContents'
import { Tab, Tabs } from './TabsAdapter'
import TermAdapter from './TermAdapter'
import Treaty from './Treaty'
import useLocalStorage from './useLocalStorage'

import * as CalloutStyles from './Callout.module.scss'
import * as ChapterStyles from './Chapter.module.scss'
import * as DetailsStyles from './Details.module.scss'
import * as FigureStyles from './Figure.module.scss'
import * as FlipCardsStyles from './FlipCards.module.scss'
import * as QuoteStyles from './Quote.module.scss'
import * as TermStyles from './Term.module.scss'
import * as TimelineStyles from './Timeline.module.scss'

const shortCodes = {
  Embed,
  Quiz,
  RadioChoice,
  Question,
  Choice,
  Resolution,
  Treaty,
  Institution,
  Tab,
  Tabs,
  Quote: ({ ...props }) => <QuoteAdapter {...props} styles={QuoteStyles} />,
  Term: ({ ...props }) => <TermAdapter styles={TermStyles} {...props} />,
  Figure: ({ ...props }) => <FigureAdapter styles={FigureStyles} {...props} />,
  LectureVideo,
  Event: ({ ...props }) => <Event styles={TimelineStyles} {...props} />,
  Timeline: ({ ...props }) => <Timeline styles={TimelineStyles} {...props} />,
  FlipCards: ({ ...props }) => <FlipCards styles={FlipCardsStyles} {...props} />,
  Card: ({ ...props }) => <Card styles={FlipCardsStyles} {...props} />,
  Details: ({ ...props }) => <Details {...props} styles={DetailsStyles} />,
  DetailsGroup: ({ ...props }) => <DetailsGroup {...props} styles={DetailsStyles} />,
  Callout: ({ ...props }) => <Callout {...props} buttonComponent={Button} styles={CalloutStyles} />,
  Map,
}

export const query = graphql`
  query ($id: String, $lu_id: String) {
    site: site {
      siteMetadata {
        title
      }
    }
    mdx(id: { eq: $id }) {
      frontmatter {
        title
      }
    }
    post: file(id: { eq: $id }) {
      id
      childMdx {
        fields {
          slug
        }
        frontmatter {
          title
          intro
          order
          reading_time
        }
        tableOfContents
      }
    }
    chapters: allFile(
      filter: { relativeDirectory: { eq: $lu_id }, name: { ne: "index" }, ext: { eq: ".mdx" } }
      sort: { childMdx: { frontmatter: { order: ASC } } }
    ) {
      nodes {
        name
        childMdx {
          fields {
            slug
          }
          frontmatter {
            title
            intro
            order
          }
        }
      }
    }
    unit: file(name: { eq: "index" }, relativeDirectory: { eq: $lu_id }) {
      name
      childMdx {
        fields {
          slug
        }
        frontmatter {
          title
          short_title
          order
          hero_background
        }
      }
    }
  }
`

const Chapter = ({ data, children }) => {
  const frontmatter = data.post.childMdx.frontmatter
  const [bookmarks, setBookmarks] = useLocalStorage('elearning-bookmarks', [])

  const bookmarkIndex = bookmarks.findIndex((el) => {
    return el.id === data.post.id
  })
  const currentIndex = data.chapters.nodes.findIndex((el) => {
    return el.childMdx.frontmatter.order === frontmatter.order
  })

  const next = data.chapters.nodes[currentIndex + 1]
  const prev = data.chapters.nodes[currentIndex - 1]

  function toggleBookmark() {
    console.log(bookmarks)
    setBookmarks((prevBookmarks) => {
      if (bookmarkIndex === -1) {
        const bookmark = {
          id: data.post.id,
        }
        return [...prevBookmarks, bookmark]
      } else {
        return prevBookmarks.filter((el) => {
          return el.id !== data.post.id
        })
      }
    })
  }

  return (
    <App>
      <StickyHeader unit={data.unit} post={data.post} next={next} prev={prev} bookmarks={bookmarks} setBookmarks={setBookmarks} />
      <article>
        <header className={ChapterStyles.header}>
          <div className={ChapterStyles.headerCopy}>
            <h1 className={ChapterStyles.title}>{frontmatter.title}</h1>
            {frontmatter.intro && <p className={ChapterStyles.intro}>{frontmatter.intro}</p>}
            <div className={ChapterStyles.headerActions}>
              <button onClick={toggleBookmark}>{bookmarkIndex === -1 ? 'Bookmark' : 'Remove bookmark'}</button>
            </div>
          </div>
        </header>
        <div className={ChapterStyles.body}>
          {data.post.childMdx.tableOfContents.items && (
            <div className={ChapterStyles.tocContainer}>
              <div className={ChapterStyles.tocContainerInner}>
                <TableOfContents items={data.post.childMdx.tableOfContents.items} />
              </div>
            </div>
          )}

          <div className={ChapterStyles.bodyText}>
            <MDXProvider components={shortCodes}>{children}</MDXProvider>
          </div>
          <nav className={ChapterStyles.pagination}>
            {next && next.childMdx.frontmatter.title && (
              <Link className={ChapterStyles.next} to={`../${next.childMdx.fields.slug}`}>
                <span className={ChapterStyles.paginationLabel}>Continue</span>
                <span className={ChapterStyles.paginationTitle}>
                  {next.childMdx.frontmatter.order}. {next.childMdx.frontmatter.title}
                </span>
                {next.childMdx.frontmatter.intro && <p className={ChapterStyles.paginationIntro}>{next.childMdx.frontmatter.intro}</p>}
              </Link>
            )}
            {prev && (
              <>
                <Link className={ChapterStyles.previous} to={`../${prev.childMdx.fields.slug}`}>
                  <span>Previous: {prev.childMdx.frontmatter.title}</span>
                </Link>
              </>
            )}
          </nav>
        </div>
      </article>
    </App>
  )
}

export function Head({ data }) {
  const chapter = data.post.childMdx.frontmatter
  const unit = data.unit.childMdx.frontmatter
  const intro = ''

  return (
    <Meta
      socialTitle={`${chapter.title} – ${unit.title}`}
      title={`${chapter.title} – ${unit.title} / ${data.site.siteMetadata.title}`}
      description={intro}
      image={{ src: getSrc(unit.hero_image), alt: unit.hero_alt }}
    />
  )
}

export default Chapter
