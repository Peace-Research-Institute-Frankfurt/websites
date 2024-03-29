import { graphql } from 'gatsby'
import React from 'react'
import useTranslations from '../hooks/useTranslations'
import App from './App'
import Footer from './Footer'
import LanguageSwitcher from './LanguageSwitcher'
import Meta from './Meta'
import * as styles from './Page.module.scss'
import PostBody from './PostBody'
import SiteHeader from './SiteHeader'

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
    post: file(id: { eq: $id }) {
      modifiedTime(locale: $language, formatString: "LL")
      childMdx {
        fields {
          slug
          locale
        }
        frontmatter {
          title
          intro
        }
      }
    }
    translations: allFile(filter: { id: { in: $translations } }) {
      nodes {
        relativeDirectory
        id
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
    pages: allFile(
      filter: {
        relativeDirectory: { glob: "**/pages/**" }
        extension: { eq: "mdx" }
        sourceInstanceName: { eq: "content" }
        childMdx: { fields: { locale: { eq: $language } } }
      }
    ) {
      nodes {
        base
        childMdx {
          fields {
            slug
          }
          frontmatter {
            title
            intro
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
  let translationData = { translations: data.translations.nodes, currentLanguage: pageContext.language, currentSlug: data.post.childMdx.fields.slug }
  let translations = useTranslations(translationData, data.allSitePage.nodes)

  return (
    <App
      pages={data.pages.nodes}
      translationData={{ translations: data.translations.nodes, currentLanguage: pageContext.language, currentSlug: data.post.childMdx.fields.slug }}
    >
      <SiteHeader pages={data.pages.nodes} translationData={translationData} color="var(--white)">
        {data.translations.nodes.length > 0 && <LanguageSwitcher translations={translations} translationData={translationData} />}
      </SiteHeader>
      <article id="content">
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <div className={styles.headerCopy}>
              <h1 className={styles.title}>{data.post.childMdx.frontmatter.title}</h1>
              {data.post.childMdx.frontmatter.intro && <p className={styles.intro}>{data.post.childMdx.frontmatter.intro}</p>}
            </div>
          </div>
        </header>
        <div className={styles.body}>
          <PostBody>{children}</PostBody>
        </div>
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
    currentLanguage: pageContext.pageLocale,
    translations: data.translations.nodes,
  }
  return <Meta translationData={translationData} title={`${frontmatter.title} – ${data.site.siteMetadata.title}`} description={frontmatter.intro} />
}

export default Page
