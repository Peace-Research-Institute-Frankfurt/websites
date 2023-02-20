import React from 'react'
import MarkdownRenderer from 'react-markdown-renderer'
import { graphql, Link } from 'gatsby'
import { GatsbyImage, getImage, getSrc } from 'gatsby-plugin-image'
import useLocalStorage from '@shared/hooks/useLocalStorage'

import App from './App'
import Meta from './Meta'
import StickyHeader from './StickyHeader'
import LearningUnitHeader from './LearningUnitHeader'

import * as styles from './LearningUnit.module.scss'

export const query = graphql`
  query ($id: String, $lu_id: String) {
    site: site {
      siteMetadata {
        title
      }
    }
    post: file(id: { eq: $id }) {
      childMdx {
        frontmatter {
          title
          learning_objectives
          authors {
            frontmatter {
              name
              author_id
              institution
              image {
                childImageSharp {
                  gatsbyImageData(width: 250)
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
              gatsbyImageData(layout: FULL_WIDTH)
            }
          }
        }
      }
    }
    chapters: allFile(
      filter: { extension: { eq: "mdx" }, name: { ne: "index" }, sourceInstanceName: { eq: "luContent" }, relativeDirectory: { eq: $lu_id } }
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
            reading_time
          }
        }
      }
    }
  }
`

const LearningUnit = ({ data, context }) => {
  const frontmatter = data.post.childMdx.frontmatter
  const authors = data.post.childMdx.frontmatter.authors
  const heroImage = getImage(frontmatter.hero_image)
  const [bookmarks, setBookmarks] = useLocalStorage('elearning-bookmarks', [])

  const bylines = authors.map((author) => {
    const fm = author.frontmatter
    const authorImage = getImage(fm.image)
    return (
      <li key={fm.name} className={styles.byline}>
        <GatsbyImage className={styles.bylineImage} image={authorImage} alt={`${fm.name} profile image`} />
        <div>
          <em>{fm.name}</em>
          <span>{fm.institution}</span>
        </div>
      </li>
    )
  })
  const bios = authors.map((author) => {
    const fm = author.frontmatter
    const authorImage = getImage(fm.image)
    return (
      <li className={styles.author} key={fm.author_id}>
        <div className={styles.authorHeader}>
          <GatsbyImage className={styles.authorImage} image={authorImage} alt={`${fm.name} profile image`} />
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
          <p className={styles.chapterIntro}>{frontmatter.intro}</p>
          {frontmatter.reading_time && <p className={styles.chapterMeta}>{frontmatter.reading_time} min read</p>}
        </Link>
      </li>
    )
  })

  return (
    <App>
      <StickyHeader bookmarks={bookmarks} setBookmarks={setBookmarks} />
      <article className={styles.container}>
        <LearningUnitHeader
          frontmatter={frontmatter}
          title={frontmatter.title}
          intro={frontmatter.intro}
          alt={frontmatter.hero_alt}
          order={frontmatter.order}
          bylines={bylines}
          image={{ src: heroImage, alt: frontmatter.hero_alt, caption: frontmatter.hero_caption, credit: frontmatter.hero_credit }}
          background={frontmatter.hero_background}
          startLink={data.chapters.nodes[0].childMdx.fields.slug}
        />
        <main>
          <section className={styles.chapters}>
            <h2 className={styles.sectionTitle}>Chapters</h2>
            <div id="chapters" className={styles.sectionContent}>
              <ol>{chapterLinks}</ol>
            </div>
          </section>
          {frontmatter.learning_objectives && (
            <section>
              <h2 className={styles.sectionTitle}>Learning Objectives</h2>
              <div className={styles.sectionContent}>
                <MarkdownRenderer className={styles.copy} markdown={frontmatter.learning_objectives} />
              </div>
            </section>
          )}

          <section>
            <h2 className={styles.sectionTitle}>About the {bios.length > 1 ? 'authors' : 'author'}</h2>
            <div className={styles.sectionContent}>
              <ul>{bios}</ul>
            </div>
          </section>
          <section>
            <h2 className={styles.sectionTitle}>Disclosures</h2>
            <div className={`${styles.disclosures} ${styles.sectionContent}`}>
              <h3>Funding</h3>
              <p>
                This Learning Unit was produced with financial assistance from the European Union. The contents of this Learning Unit are however the
                sole responsibility of the author(s) and should under no circumstances be regarded as reflecting the position of the European Union.
              </p>
              <h3>Content Warning</h3>
              <p>This learning unit may contain audio-visual material or texts, which may not be suitable for all audiences. </p>
              <h3>External Links</h3>
              <p>
                The site may contain hyperlink text references (’Links’) to other sites that are offered by third parties. These Links are made solely
                for the purpose of information and as an additional service for users. Only the respective operator is responsible for all content and
                statements on linked Internet sites. Therefore, HSFK cannot guarantee for the correctness and accuracy or any other aspect of third
                party sites.
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
