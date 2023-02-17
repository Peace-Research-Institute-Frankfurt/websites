import React, { useEffect, useState } from 'react'
import { graphql, Link } from 'gatsby'
import { getSrc } from 'gatsby-plugin-image'
import { MDXProvider } from '@mdx-js/react'

import Callout from '@shared/components/Callout'
import { Details, DetailsGroup } from '@shared/components/Details'
import { Event, Timeline } from '@shared/components/Timeline'
import { FlipCards, Card } from '@shared/components/FlipCards'
import useLocalStorage from '@shared/hooks/useLocalStorage'

import App from './App'
import Button from './ButtonAdapter'
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

import * as CalloutStyles from './Callout.module.scss'
import * as styles from './Chapter.module.scss'
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
  const [currentSection, setCurrentSection] = useState('')
  const currentIndex = data.chapters.nodes.findIndex((el) => {
    return el.childMdx.frontmatter.order === frontmatter.order
  })

  const next = data.chapters.nodes[currentIndex + 1]
  const prev = data.chapters.nodes[currentIndex - 1]

  const headlines = data.post.childMdx.tableOfContents

  useEffect(() => {
    // Attach intersection observers to heading elements
    console.log(headlines)
    let observer = new IntersectionObserver((entries, observer) => {
      const e = entries[0]
      if (e.isIntersecting) {
        const sectionId = e.target.getAttribute('id')
        setCurrentSection(sectionId)
        console.log(`Setting current section to ${sectionId}`)
      }
    }, {})
    headlines.items.forEach((el) => {
      const targetEl = document.querySelector(el.url)
      observer.observe(targetEl)
    })
    // console.log(data.post.childMdx.tableOfContents)
  }, [headlines])

  return (
    <App>
      <StickyHeader unit={data.unit} post={data.post} next={next} prev={prev} bookmarks={bookmarks} setBookmarks={setBookmarks} />
      <article>
        <header className={styles.header}>
          <div className={styles.headerCopy}>
            <h1 className={styles.title}>{frontmatter.title}</h1>
            {frontmatter.intro && <p className={styles.intro}>{frontmatter.intro}</p>}
          </div>
        </header>
        <div className={styles.body}>
          {data.post.childMdx.tableOfContents.items?.length > 1 && (
            <div className={styles.tocContainer}>
              <details className={styles.tocDetails} open>
                <summary className={styles.tocSummary}>On this page</summary>
                <div className={styles.tocContainerInner}>
                  <TableOfContents items={data.post.childMdx.tableOfContents.items} currentItem={currentSection} />
                </div>
              </details>
            </div>
          )}

          <div className={styles.bodyText}>
            <MDXProvider components={shortCodes}>{children}</MDXProvider>
          </div>
          <nav className={styles.pagination}>
            {next && next.childMdx.frontmatter.title && (
              <Link className={styles.next} to={`../${next.childMdx.fields.slug}`}>
                <span className={styles.paginationLabel}>Next Chapter</span>
                <span className={styles.paginationTitle}>
                  {next.childMdx.frontmatter.order}. {next.childMdx.frontmatter.title}
                </span>
                {next.childMdx.frontmatter.intro && <p className={styles.paginationIntro}>{next.childMdx.frontmatter.intro}</p>}
              </Link>
            )}
            {prev && (
              <>
                <Link className={styles.previous} to={`../${prev.childMdx.fields.slug}`}>
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
