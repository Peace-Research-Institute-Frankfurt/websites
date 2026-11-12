import React from 'react'
import { graphql } from 'gatsby'
import useTranslations from '../hooks/useTranslations'
import App from './App'
import Meta from './Meta'
import PostBody from './PostBody'
import StickyHeader from './StickyHeader'
import LanguageSwitcher from './LanguageSwitcher'

import * as styles from './Chapter.module.scss'

export const query = graphql`
  query ($id: String!, $language: String!, $translations: [String!]) {
    site: site {
      siteMetadata {
        title
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
    mdx(id: { eq: $id }) {
      id
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
    translations: allFile(filter: { id: { in: $translations } }) {
      nodes {
        id
        childMdx {
          fields {
            slug
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

const Page = ({ data, children, pageContext }) => {
  const frontmatter = data.post.childMdx.frontmatter

  let translationData = { translations: data.translations.nodes, currentLanguage: pageContext.language, currentSlug: data.post.childMdx.fields.slug }
  let translations = useTranslations(translationData, data.allSitePage.nodes)

  return (
    <App>
      <StickyHeader post={data.post}>
        {data.translations.nodes.length > 0 && (
          <LanguageSwitcher translations={translations} translationData={translationData} />
        )}
      </StickyHeader>

      <article id="content">
        <header className={styles.header}>
          <div className={styles.headerCopy}>
            <h1 className={styles.title}>{frontmatter.title}</h1>
            {frontmatter.intro && <p className={styles.intro}>{frontmatter.intro}</p>}
          </div>
        </header>
        <div className={styles.body}>
          <div className={styles.bodyText}>
            <PostBody content={children} />
          </div>
        </div>
      </article>
    </App>
  )
}

export function Head({ data }) {
  const post = data.post.childMdx.frontmatter
  const intro = ''

  return <Meta socialTitle={`${post.title}`} title={`${post.title} / ${data.site.siteMetadata.title}`} description={intro} />
}

export default Page
