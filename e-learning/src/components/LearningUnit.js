import React from 'react'
import MarkdownRenderer from 'react-markdown-renderer'
import { graphql, Link } from 'gatsby'
import { GatsbyImage, getImage, getSrc } from 'gatsby-plugin-image'
import useLocalStorage from '@shared/hooks/useLocalStorage'

import App from './App'
import Meta from './Meta'
import StickyHeader from './StickyHeader'
import LearningUnitHeader from './LearningUnitHeader'
import ArrowRight from '../assets/icons/arrow-right.svg'
import * as ButtonStyles from './Button.module.scss'

import * as styles from './LearningUnit.module.scss'
import authorsToString from './authorsToString'

export const query = graphql`
  query ($id: String, $lu_id: String) {
    site: site {
      buildTime(formatString: "D MMMM Y")
      siteMetadata {
        title
        siteUrl
      }
    }
    post: file(id: { eq: $id }) {
      childMdx {
        body
        fields {
          slug
        }
        frontmatter {
          title
          authors {
            frontmatter {
              name
              author_id
              institution
              image {
                childImageSharp {
                  gatsbyImageData(width: 250, placeholder: DOMINANT_COLOR)
                }
              }
            }
            parent {
              ... on Mdx {
                body
              }
            }
          }
          intro
          order
          hero_alt
          hero_credit
          hero_caption
          hero_background
          hero_image {
            childImageSharp {
              gatsbyImageData(layout: FULL_WIDTH, placeholder: DOMINANT_COLOR)
            }
          }
          updates {
            date(formatString: "D MMMM Y")
            description
          }
        }
      }
    }
    chapters: allFile(
      filter: {
        extension: { eq: "mdx" }
        name: { nin: ["index", "__print"] }
        sourceInstanceName: { eq: "luContent" }
        relativeDirectory: { eq: $lu_id }
      }
      sort: { childMdx: { frontmatter: { order: ASC } } }
    ) {
      nodes {
        id
        name
        relativeDirectory
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
  }
`

const LearningUnit = ({ data, children }) => {
  const frontmatter = data.post.childMdx.frontmatter
  const authors = data.post.childMdx.frontmatter?.authors ?? []
  const heroImage = getImage(frontmatter.hero_image)
  const [bookmarks, setBookmarks] = useLocalStorage('elearning-bookmarks', [])
  const startLink = data.chapters.nodes[0].childMdx.fields.slug

  const bios = authors.map((author) => {
    const fm = author.frontmatter
    const authorImage = getImage(fm.image)
    return (
      <li className={styles.author} key={fm.author_id}>
        <div className={styles.authorHeader}>
          {authorImage && <GatsbyImage className={styles.authorImage} image={authorImage} alt={`${fm.name} profile image`} />}
          <div>
            <h3 className={styles.authorTitle}>{fm.name}</h3>
            <span className={styles.authorInstitution}>{fm.institution}</span>
          </div>
        </div>
        <MarkdownRenderer markdown={author.parent.body} />
      </li>
    )
  })
  const chapterLinks = data.chapters.nodes.map((node, index) => {
    const frontmatter = node.childMdx.frontmatter
    return (
      <li key={node.name}>
        <Link to={node.childMdx.fields.slug}>
          <h3 className={styles.chapterTitle}>
            {index + 1}. {frontmatter.title}
          </h3>
          {frontmatter.intro && <p className={styles.chapterIntro}>{frontmatter.intro}</p>}
        </Link>
      </li>
    )
  })

  return (
    <App>
      <StickyHeader chapters={data.chapters.nodes} bookmarks={bookmarks} setBookmarks={setBookmarks} unit={data.post} />
      <article className={styles.container} id="content">
        <LearningUnitHeader
          frontmatter={frontmatter}
          title={frontmatter.title}
          intro={frontmatter.intro}
          alt={frontmatter.hero_alt}
          order={frontmatter.order}
          image={{ src: heroImage, alt: frontmatter.hero_alt, caption: frontmatter.hero_caption, credit: frontmatter.hero_credit }}
          background={frontmatter.hero_background}
          startLink={startLink}
        />
        <main className={styles.main}>
          <section className={styles.chapters}>
            <h2 className={styles.sectionTitle}>Chapters</h2>
            <div id="chapters" className={styles.sectionContent}>
              <ol>{chapterLinks}</ol>
            </div>
          </section>
          {data.post.childMdx.body.length > 0 && (
            <section>
              <h2 className={styles.sectionTitle}>Learning Objectives</h2>
              <div className={`${styles.sectionContent} ${styles.copy}`}>{children}</div>
            </section>
          )}
          <section>
            <h2 className={styles.sectionTitle}>Credits</h2>
            <div className={styles.sectionContent}>
              <ul>{bios}</ul>
            </div>
          </section>
          <section>
            <div className={`${styles.sectionContent} ${styles.unitActions}`}>
              <Link to={startLink} className={`${ButtonStyles.container} ${ButtonStyles.primary}`}>
                Start learning unit
                <div className={ButtonStyles.icon}>
                  <ArrowRight />
                </div>
              </Link>
              <a
                className={`${ButtonStyles.container} ${ButtonStyles.secondary}`}
                href={`/static/eunpdc-${data.post.childMdx.fields.slug.replace(/\//g, '')}.pdf`}
              >
                Download PDF
              </a>
            </div>
          </section>
          {frontmatter.updates && frontmatter.updates.length > 0 && (
            <section>
              <h2 className={styles.sectionTitle}>Updates</h2>
              <div className={styles.sectionContent}>
                <ul className={styles.updates}>
                  {frontmatter.updates.map((el, i) => {
                    return (
                      <li key={`update.${i}`}>
                        <date>{el.date}</date>
                        <p>{el.description}</p>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </section>
          )}
          <section>
            <h2 className={styles.sectionTitle}>Disclosures</h2>
            <div className={`${styles.disclosures} ${styles.sectionContent}`}>
              <h3>Content Warning</h3>
              <p>This learning unit may contain audio-visual material or texts, which may not be suitable for all audiences. </p>
              <h3>Funding</h3>
              <p>
                This Learning Unit was produced with financial assistance from the European Union. The contents of this Learning Unit are however the
                sole responsibility of the author(s) and should under no circumstances be regarded as reflecting the position of the European Union.
              </p>
              <h3>External Links</h3>
              <p>
                The site may contain hyperlink text references (’Links’) to other sites that are offered by third parties. These Links are made
                available solely for the purpose of information and as an additional service for users. Only the respective operator is responsible
                for all content and statements on linked Internet sites. Therefore, PRIF cannot guarantee the correctness and accuracy or any other
                aspect of third party sites.
              </p>
              <h3>Preferred Citation</h3>
              <p>
                {authorsToString(authors)}, "{frontmatter.title}" in EUNPDC eLearning, ed. Niklas Schörnig, Peace Research Institute Frankfurt.
                Available at {data.site.siteMetadata.siteUrl}
                {data.post.childMdx.fields.slug}, last modified {data.site.buildTime}
              </p>
            </div>
          </section>
        </main>
      </article>
    </App>
  )
}

export function Head({ data }) {
  const post = data.post.childMdx.frontmatter
  return (
    <Meta
      title={`${post.title} – ${data.site.siteMetadata.title}`}
      description={post.intro}
      image={{ src: getSrc(post.hero_image), alt: post.hero_alt }}
    />
  )
}

export default LearningUnit
