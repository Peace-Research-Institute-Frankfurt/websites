import React from 'react'
import { Link, graphql } from 'gatsby'
import App from './App'
import PostBody from './PostBody'
import PostHeader from './PostHeader'
import Meta from './Meta'
import { useTranslation } from 'gatsby-plugin-react-i18next'
import Lines from '../images/trace-line.svg'
import FigureAdapter from "./FigureAdapter"
import useColors from "../hooks/useColors.js"
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
          color_secondary
          eyebrow
          trace_lines
          hero_alt
          hero_credit
          hero_image
          hero_license
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
  const { t } = useTranslation()

  const frontmatter = data.post.childMdx.frontmatter
  const posts = data.posts.nodes.filter((node) => {
    return node.relativeDirectory.includes(data.report.relativeDirectory)
  })
  const currentIndex = posts.findIndex((el) => {
    return el.childMdx.frontmatter.title === frontmatter.title
  })
  const next = posts[currentIndex + 1] || null
  const previous = posts[currentIndex - 1] || null
  
  const {text, background, knockout} = useColors(frontmatter.color)
      
  const appStyles = {
    '--fc-text': text.toString(),
    '--fc-background': frontmatter.color_secondary ? frontmatter.color_secondary : background.toString(),
    '--fc-knockout': knockout.toString()
  }

const heroImage = (
    <>
      {frontmatter.hero_image && (
        <FigureAdapter
          className={styles.heroImage}
          src={frontmatter.hero_image}
          alt={frontmatter.hero_alt}
          license={frontmatter.hero_license}
          credit={frontmatter.hero_credit}
        ></FigureAdapter>
      )}
      {frontmatter.trace_lines && (
        <div className={styles.traceLines}>
          <Lines />
        </div>
      )}
    </>
  )

  const pagination = (
    <nav className={styles.pagination}>
      {previous && (
        <Link className={styles.paginationLink} rel="prev" to={`../${previous.childMdx.fields.slug}`}>
          <span>{t('Prev')}</span>
        </Link>
      )}
      {next && (
        <Link className={styles.paginationLink} rel="next" to={`../${next.childMdx.fields.slug}`}>
          <span>{t('Next')}</span>
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
        <PostHeader title={frontmatter.title} intro={frontmatter.intro} eyebrow={frontmatter.eyebrow} heroImage={heroImage} />
        <PostBody>{children}</PostBody>
      </article>
    </App>
  )
}

export function Head({ data, pageContext, location }) {
  const frontmatter = data.post.childMdx.frontmatter
  const year = data.post.relativeDirectory.replace(/(.{2})\/(reports)\//g, '').replace('/posts', '')
  const translationData = {
    currentPath: location,
    currentSlug: data.post.childMdx.fields.slug,
    currentLanguage: pageContext.language,
    translations: data.translations.nodes,
  }
  return <Meta translationData={translationData} title={`${frontmatter.title} – ${data.site.siteMetadata.title} ${year}`} description={frontmatter.intro} />
}

export default Post
