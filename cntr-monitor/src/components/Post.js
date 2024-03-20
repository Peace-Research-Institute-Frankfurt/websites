import { graphql } from 'gatsby'
import { Link, useTranslation } from 'gatsby-plugin-react-i18next'
import React from 'react'
import MarkdownRenderer from 'react-markdown-renderer'
import useColors from '../hooks/useColors.js'
import useTranslations from '../hooks/useTranslations.js'
import Arrow from '../images/arrow-right.svg'
import App from './App'
import { Bylines } from './Bylines.js'
import Footer from './Footer.js'
import LanguageSwitcher from './LanguageSwitcher.js'
import Meta from './Meta'
import * as styles from './Post.module.scss'
import PostBody from './PostBody'
import SiteHeader from './SiteHeader.js'

export const query = graphql`
  query ($id: String!, $language: String!, $translations: [String!], $issueId: String!) {
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

    issue: file(id: { eq: $issueId }) {
      relativeDirectory
      childMdx {
        fields {
          locale
        }
        frontmatter {
          title
          color
          year
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
          eyebrow
          category
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
        base
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
    allSitePage {
      nodes {
        path
        pageContext
      }
    }
  }
`
export default function Post({ data, pageContext, children }) {
  const { t } = useTranslation()

  const frontmatter = data.post.childMdx.frontmatter
  const posts = data.posts.nodes.filter((node) => {
    return node.relativeDirectory.includes(data.issue.relativeDirectory)
  })
  const currentIndex = posts.findIndex((el) => {
    return el.childMdx.frontmatter.title === frontmatter.title
  })

  let authors = null
  if (data.post.childMdx.frontmatter.authors) {
    authors = data.authors.nodes.filter((node) => {
      const found = data.post.childMdx.frontmatter.authors.findIndex((el) => {
        return el.frontmatter.author_id === node.childMdx.frontmatter.author_id
      })
      return found !== -1
    })
  }
  const next = posts[currentIndex + 1] || null
  const previous = posts[currentIndex - 1] || null

  const pagination = (
    <nav className={styles.pagination}>
      {previous && (
        <Link className={`${styles.paginationPrev} ${styles.paginationLink}`} rel="prev" to={`../${previous.childMdx.fields.slug}`}>
          <Arrow />
          <span>{t('Previous')}</span>
        </Link>
      )}
      {next && (
        <Link className={`${styles.paginationLink}`} rel="next" to={`../${next.childMdx.fields.slug}`}>
          <Arrow />
          <span>{t('Next')}</span>
        </Link>
      )}
    </nav>
  )

  const translationData = {
    translations: data.translations.nodes,
    currentLanguage: pageContext.language,
    currentSlug: data.post.childMdx.fields.slug,
  }
  const translations = useTranslations(translationData, data.allSitePage.nodes)

  return (
    <App>
      <SiteHeader pages={data.pages.nodes} color="white" post={data.post} issue={data.issue} translationData={translationData}>
        {(previous || next) && pagination}
        {data.translations.nodes.length > 0 && <LanguageSwitcher translations={translations} translationData={translationData} />}
      </SiteHeader>
      <article id="content" className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <div className={styles.headerCopy}>
              {(data.post.childMdx.frontmatter.eyebrow || data.post.childMdx.frontmatter.category) && (
                <span className={styles.eyebrow}>
                  {data.post.childMdx.frontmatter.category}
                  {data.post.childMdx.frontmatter.category && data.post.childMdx.frontmatter.eyebrow && ' · '}
                  {data.post.childMdx.frontmatter.eyebrow}
                </span>
              )}
              <h1 className={styles.title}>{data.post.childMdx.frontmatter.title}</h1>
              <div className={styles.intro}>
                <MarkdownRenderer markdown={data.post.childMdx.frontmatter.intro} />
              </div>
            </div>
          </div>
        </header>
        <main className={styles.body}>
          <PostBody>
            {children}
            {authors && (
              <aside>
                <Bylines authors={authors} />
              </aside>
            )}
          </PostBody>
        </main>
      </article>
      <Footer pages={data.pages.nodes} language={translationData.currentLanguage} />
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
  const { primary, dark, light, knockout } = useColors(
    data.issue.childMdx.frontmatter.color,
    ['Analyse', 'Analysis', 'Anhang', 'Appendix'].includes(data.post.childMdx.frontmatter.category)
  )

  const bodyStyles = {
    '--fc-primary': primary.toString(),
    '--fc-dark': dark.toString(),
    '--fc-light': light.toString(),
    '--fc-knockout': knockout.toString(),
  }
  return (
    <>
      <body style={bodyStyles} />
      <Meta translationData={translationData} title={`${frontmatter.title} – ${data.site.siteMetadata.title}`} description={frontmatter.intro} />
    </>
  )
}
