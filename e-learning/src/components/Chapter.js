import React from 'react'
import { graphql, Link } from 'gatsby'
import { getSrc } from 'gatsby-plugin-image'
import App from './App'
import { MDXProvider } from '@mdx-js/react'
import * as ChapterStyles from './Chapter.module.scss'
import Meta from './Meta'
import { Quiz, RadioChoice, Question } from './Quiz.js'
import { Choice } from './MultipleChoice'
import TermAdapter from './TermAdapter'
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
import Resolution from './Resolution'
import Treaty from './Treaty'
import Institution from './Institution'
import { Tab, Tabs } from './TabsAdapter'
import { Callout, Details, DetailsGroup, FlipCards, Card, Timeline, Event } from '@prif/shared'
import * as QuoteStyles from './Quote.module.scss'
import * as CalloutStyles from './Callout.module.scss'
import * as FigureStyles from './Figure.module.scss'
import * as DetailsStyles from './Details.module.scss'
import * as FlipCardsStyles from './FlipCards.module.scss'
import * as TimelineStyles from './Timeline.module.scss'
import * as TermStyles from './Term.module.scss'
import * as buttonStyles from './Button.module.scss'

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
  Callout: ({ ...props }) => <Callout {...props} buttonStyles={buttonStyles} styles={CalloutStyles} />,
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
  const [bookmarks] = useLocalStorage('bookmarks', [])
  const currentIndex = data.chapters.nodes.findIndex((el) => {
    return el.childMdx.frontmatter.order === frontmatter.order
  })

  const next = data.chapters.nodes[currentIndex + 1]
  const prev = data.chapters.nodes[currentIndex - 1]

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
      <article>
        <header className={ChapterStyles.header}>
          <p className={ChapterStyles.eyebrow}>Learning Unit {data.unit.childMdx.frontmatter.order}</p>
          <h1 className={ChapterStyles.title}>{frontmatter.title}</h1>
          {frontmatter.intro && <p className={ChapterStyles.intro}>{frontmatter.intro}</p>}
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
                <span className={ChapterStyles.paginationLabel}>Back</span>
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
