import React from 'react'
import { graphql, Link } from 'gatsby'
import { getSrc } from 'gatsby-plugin-image'
import App from './App'
import { MDXProvider } from '@mdx-js/react'
import * as ChapterStyles from './Chapter.module.scss'
import Meta from './Meta'
import { Quiz, RadioChoice, Question } from './Quiz.js'
import { Choice } from './MultipleChoice'
import Term from './Term'
import FigureAdapter from './FigureAdapter'
import QuoteAdapter from './QuoteAdapter'
import SiteHeader from './SiteHeader'
import LectureVideo from './LectureVideo'
import SiteFooter from './SiteFooter'
import useLocalStorage from './useLocalStorage'
import { Embed } from './Embed'
import StickyHeader from './StickyHeader'
import TableOfContents from './TableOfContents'
import Map from './Map'
import { Callout, Tab, Tabs, Details, DetailsGroup, FlipCards, Card, Timeline, Event } from '@prif/shared'
import * as QuoteStyles from './Quote.module.scss'
import * as CalloutStyles from './Callout.module.scss'
import * as TabStyles from './Tabs.module.scss'
import * as FigureStyles from './Figure.module.scss'
import * as DetailsStyles from './Details.module.scss'
import * as FlipCardsStyles from './FlipCards.module.scss'
import * as TimelineStyles from './Timeline.module.scss'

const shortCodes = {
  Embed,
  Quiz,
  RadioChoice,
  Question,
  Choice,
  Quote: ({ ...props }) => <QuoteAdapter {...props} styles={QuoteStyles} />,
  Term,
  Figure: ({ ...props }) => <FigureAdapter styles={FigureStyles} {...props} />,
  LectureVideo,
  Event: ({ ...props }) => <Event styles={TimelineStyles} {...props} />,
  Timeline: ({ ...props }) => <Timeline styles={TimelineStyles} {...props} />,
  FlipCards: ({ ...props }) => <FlipCards styles={FlipCardsStyles} {...props} />,
  Card: ({ ...props }) => <Card styles={FlipCardsStyles} {...props} />,
  Details: ({ ...props }) => <Details {...props} styles={DetailsStyles} />,
  DetailsGroup: ({ ...props }) => <DetailsGroup {...props} styles={DetailsStyles} />,
  Tabs: ({ ...props }) => <Tabs {...props} styles={TabStyles} />,
  Tab: ({ ...props }) => <Tab {...props} styles={TabStyles} />,
  Callout: ({ ...props }) => <Callout {...props} styles={CalloutStyles} />,
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
  const [bookmarks, setBookmarks] = useLocalStorage('bookmarks', [])
  const currentIndex = data.chapters.nodes.findIndex((el) => {
    return el.childMdx.frontmatter.order === frontmatter.order
  })

  const next = data.chapters.nodes[currentIndex + 1]
  const prev = data.chapters.nodes[currentIndex - 1]

  const headerStyles = {
    backgroundColor: data.unit.childMdx.frontmatter.hero_background,
  }

  // function toggleBookmark() {
  //   setBookmarks((prevBookmarks) => {
  //     if (bookmarkIndex === -1) {
  //       const bookmark = {
  //         eyebrow: `Unit ${data.unit.childMdx.frontmatter.order}`,
  //         title: frontmatter.title,
  //         slug: data.post.childMdx.slug,
  //       }
  //       return [...prevBookmarks, bookmark]
  //     } else {
  //       return prevBookmarks.filter((el) => {
  //         return el.slug !== data.post.childMdx.slug
  //       })
  //     }
  //   })
  // }

  return (
    <App>
      <SiteHeader bookmarks={bookmarks} unit={data.unit.childMdx.frontmatter.order} chapter={frontmatter.title} />
      <article>
        <header className={ChapterStyles.header} style={headerStyles}>
          <Link className={ChapterStyles.unit} to={`../`}>
            Unit {data.unit.childMdx.frontmatter.order} &middot; {data.unit.childMdx.frontmatter.title}
          </Link>
          <h1 className={ChapterStyles.title}>{frontmatter.title}</h1>
          {frontmatter.intro && <p className={ChapterStyles.intro}>{frontmatter.intro}</p>}
          <span className={ChapterStyles.readingTime}>{frontmatter.reading_time} min read</span>
        </header>
        <StickyHeader unit={data.unit} post={data.post} next={next} prev={prev} />
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
              <Link style={headerStyles} className={ChapterStyles.next} to={`../${next.childMdx.fields.slug}`}>
                <span className={ChapterStyles.paginationLabel}>Next</span>
                <span className={ChapterStyles.paginationTitle}>
                  {next.childMdx.frontmatter.order}. {next.childMdx.frontmatter.title}
                </span>
                {next.childMdx.frontmatter.intro && <p className={ChapterStyles.paginationIntro}>{next.childMdx.frontmatter.intro}</p>}
              </Link>
            )}
            {prev && (
              <>
                <span className={ChapterStyles.paginationLabel}>Previous</span>
                <Link className={ChapterStyles.previous} to={`../${prev.childMdx.fields.slug}`}>
                  <span>{prev.childMdx.frontmatter.title}</span>
                </Link>
              </>
            )}
          </nav>
        </div>
      </article>
      <SiteFooter />
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
