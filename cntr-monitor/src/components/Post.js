import React from 'react'
import { Link, graphql } from 'gatsby'
import App from './App'
import PostBody from './PostBody'
import Footer from './Footer.js'
import Meta from './Meta'
import { useTranslation } from 'gatsby-plugin-react-i18next'
import useTranslations from '../hooks/useTranslations.js'
import SiteHeader from './SiteHeader.js'
import LanguageSwitcher from './LanguageSwitcher.js'
import useColors from '../hooks/useColors.js'
import Arrow from '../images/arrow-right.svg'
import * as styles from './Post.module.scss'

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
          color
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
  const next = posts[currentIndex + 1] || null
  const previous = posts[currentIndex - 1] || null

  const pagination = (
    <nav>
      <Link to="../">{t('Issue Overview')}</Link>
      {previous && (
        <Link rel="prev" to={`../${previous.childMdx.fields.slug}`}>
          <Arrow />
          <span>{t('Previous')}</span>
        </Link>
      )}
      {next && (
        <Link rel="next" to={`../${next.childMdx.fields.slug}`}>
          <Arrow />
          <span>{t('Next')}</span>
        </Link>
      )}
    </nav>
  )

  let translationData = { translations: data.translations.nodes, currentLanguage: pageContext.language, currentSlug: data.post.childMdx.fields.slug }
  let translations = useTranslations(translationData, data.allSitePage.nodes)

  return (
    <App>
      <SiteHeader post={data.post} translationData={translationData}>
        {pagination && pagination}
        {data.translations.nodes.length > 0 && <LanguageSwitcher translations={translations} translationData={translationData} />}
      </SiteHeader>
      <article id="content" className={styles.container}>
        <h1 className={styles.title}>{data.post.childMdx.frontmatter.title}</h1>
        <PostBody>{children}</PostBody>
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
  const bodyStyles = {}
  return (
    <>
      <body style={bodyStyles} />
      <Meta translationData={translationData} title={`${frontmatter.title} – ${data.site.siteMetadata.title}`} description={frontmatter.intro} />
    </>
  )
}
