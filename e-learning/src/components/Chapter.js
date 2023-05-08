import React from 'react'
import { graphql, Link } from 'gatsby'
import { getSrc } from 'gatsby-plugin-image'
import Balancer from 'react-wrap-balancer'
import App from './App'
import Meta from './Meta'
import PostBody from './PostBody'
import StickyHeader from './StickyHeader'
import TableOfContents from './TableOfContents'
import * as styles from './Chapter.module.scss'

export const query = graphql`
  query ($id: String, $lu_id: String) {
    site: site {
      siteMetadata {
        title
      }
    }
    post: file(id: { eq: $id }) {
      id
      childMdx {
        tableOfContents
        fields {
          slug
        }
        frontmatter {
          title
          intro
          order
          reading_time
        }
      }
    }
    chapters: allFile(
      filter: { relativeDirectory: { eq: $lu_id }, name: { ne: "index" }, ext: { eq: ".mdx" } }
      sort: { childMdx: { frontmatter: { order: ASC } } }
    ) {
      nodes {
        name
        id
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
  const currentIndex = data.chapters.nodes.findIndex((el) => {
    return el.childMdx.frontmatter.order === frontmatter.order
  })

  const next = data.chapters.nodes[currentIndex + 1]
  const prev = data.chapters.nodes[currentIndex - 1]

  return (
    <App>
      <StickyHeader unit={data.unit} post={data.post} next={next} prev={prev} chapters={data.chapters.nodes} />
      <article id="content">
        <header className={styles.header}>
          <div className={styles.headerCopy}>
            <span className={styles.eyebrow}>Chapter {frontmatter.order}</span>
            <h1 className={styles.title}>
              <Balancer>{frontmatter.title}</Balancer>
            </h1>
            {frontmatter.intro && <p className={styles.intro}>{frontmatter.intro}</p>}
          </div>
        </header>
        <div className={styles.body}>
          {data.post.childMdx.tableOfContents.items?.length > 1 && (
            <aside className={styles.tocContainer}>
              <div className={styles.tocInner}>
                <h4>On this page</h4>
                <TableOfContents items={data.post.childMdx.tableOfContents.items} />
              </div>
            </aside>
          )}
          <div className={styles.bodyText}>
            <PostBody content={children} />
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
              <p className={styles.previous}>
                <span>Previous Chapter:</span> <Link to={`../${prev.childMdx.fields.slug}`}>{prev.childMdx.frontmatter.title}</Link>
              </p>
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
