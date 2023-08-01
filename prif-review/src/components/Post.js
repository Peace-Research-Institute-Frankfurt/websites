import React from 'react'
import { Link, graphql } from 'gatsby'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import Color from 'colorjs.io'
import App from './App'
import PostBody from './PostBody'
import Meta from './Meta'
import MarkdownRenderer from 'react-markdown-renderer'
import * as styles from './Post.module.scss'

export const query = graphql`
  query ($id: String!, $language: String!, $translations: [String!], $reportId: String!) {
    site {
      siteMetadata {
        title
        siteUrl
      }
    }
    locales: allLocale(filter: { language: { eq: $language } }) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }

    report: file(id: { eq: $reportId }) {
      relativeDirectory
      childMdx {
        fields {
          locale
        }
        frontmatter {
          title
        }
      }
    }

    post: file(id: { eq: $id }) {
      relativeDirectory
      childMdx {
        fields {
          slug
        }
        frontmatter {
          title
          intro
          order
          color
          eyebrow
          hero_alt
          hero_credit
          hero_image {
            childImageSharp {
              gatsbyImageData(width: 1000, placeholder: NONE)
            }
          }
          authors {
            frontmatter {
              author_id
            }
          }
        }
      }
    }
    posts: allFile(
      filter: {
        relativeDirectory: { glob: "**/posts/**" }
        extension: { eq: "mdx" }
        sourceInstanceName: { eq: "content" }
        childMdx: { fields: { locale: { eq: $language } } }
      }
      sort: { childMdx: { frontmatter: { order: ASC } } }
    ) {
      nodes {
        id
        relativeDirectory
        childMdx {
          fields {
            slug
          }
          frontmatter {
            title
            order
          }
        }
      }
    }
    authors: allFile(
      filter: {
        relativeDirectory: { glob: "**/authors" }
        extension: { eq: "mdx" }
        sourceInstanceName: { eq: "content" }
        childMdx: { fields: { locale: { eq: $language } } }
      }
    ) {
      nodes {
        id
        childMdx {
          frontmatter {
            name
            author_id
          }
          body
        }
      }
    }
    pages: allFile(
      filter: {
        relativeDirectory: { glob: "**/pages/**" }
        extension: { eq: "mdx" }
        sourceInstanceName: { eq: "content" }
        childMdx: { fields: { locale: { eq: $language } } }
      }
    ) {
      nodes {
        id
        childMdx {
          fields {
            slug
          }
          frontmatter {
            title
            order
          }
        }
      }
    }

    translations: allFile(filter: { id: { in: $translations } }) {
      nodes {
        id
        relativeDirectory
        childMdx {
          fields {
            locale
            slug
          }
          frontmatter {
            title
          }
        }
      }
    }
  }
`
const Post = ({ data, pageContext, children }) => {
  const frontmatter = data.post.childMdx.frontmatter
  const posts = data.posts.nodes.filter((node) => {
    return node.relativeDirectory.includes(data.report.relativeDirectory)
  })
  const currentIndex = posts.findIndex((el) => {
    return el.childMdx.frontmatter.title === frontmatter.title
  })
  const next = posts[currentIndex + 1] || null
  const previous = posts[currentIndex - 1] || null

  let appStyles = {}
  if (frontmatter.color) {
    const color = new Color(frontmatter.color)
    appStyles['--fc-text'] = color.toString()
    appStyles['--fc-background'] = color.set({ 'lch.l': 97, 'lch.c': 2, 'lch.h': (h) => h + 10 }).toString()
  }

  let heroImage = null
  if (frontmatter.hero_image) {
    heroImage = (
      <div className={styles.heroImage}>
        <GatsbyImage loading="eager" image={getImage(frontmatter.hero_image)} alt={frontmatter.hero_alt} />
      </div>
    )
  }

  const pagination = (
    <nav className={styles.pagination}>
      {previous && (
        <Link className={styles.paginationLink} rel="prev" to={`../${previous.childMdx.fields.slug}`}>
          Prev
        </Link>
      )}
      {next && (
        <Link className={styles.paginationLink} rel="next" to={`../${next.childMdx.fields.slug}`}>
          Next
        </Link>
      )}
    </nav>
  )

  return (
    <App
      translationData={{ translations: data.translations.nodes, currentLanguage: pageContext.language, currentSlug: data.post.childMdx.fields.slug }}
      pages={data.pages.nodes}
      pagination={pagination}
      styles={appStyles}
      report={data.report}
    >
      <article id="content" className={styles.postContainer}>
        <header className={styles.header}>
          <div className={styles.headerInner}>
            {frontmatter.eyebrow && <span className={styles.eyebrow}>{frontmatter.eyebrow}</span>}
            <h1 className={styles.title}>{frontmatter.title}</h1>
            {heroImage && heroImage}
            {frontmatter.intro && (
              <div className={styles.intro}>
                <MarkdownRenderer markdown={frontmatter.intro} />
              </div>
            )}
          </div>
        </header>
        <section className={styles.body}>
          <PostBody>{children}</PostBody>
        </section>
      </article>
    </App>
  )
}

export function Head({ data, pageContext, location }) {
  const frontmatter = data.post.childMdx.frontmatter
  const translationData = {
    currentPath: location,
    currentSlug: data.post.childMdx.fields.slug,
    currentLanguage: pageContext.language,
    translations: data.translations.nodes,
  }
  return <Meta translationData={translationData} title={`${frontmatter.title} – ${data.site.siteMetadata.title}`} description={frontmatter.intro} />
}

export default Post
