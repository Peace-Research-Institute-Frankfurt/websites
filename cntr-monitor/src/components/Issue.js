import { graphql } from 'gatsby'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import { Link, useTranslation } from 'gatsby-plugin-react-i18next'
import React from 'react'
import MarkdownRenderer from 'react-markdown-renderer'
import useColors from '../hooks/useColors.js'
import useTranslations from '../hooks/useTranslations.js'
import AboutSection from './AboutSection.js'
import App from './App.js'
import Footer from './Footer.js'
import * as styles from './Issue.module.scss'
import LanguageSwitcher from './LanguageSwitcher.js'
import Meta from './Meta.js'
import SiteHeader from './SiteHeader.js'
import DownloadIcon from '../images/download.svg'
import PartnerLogos from './PartnerLogos.js'

export const query = graphql`
  query ($id: String!, $language: String!, $postsDirectory: String!) {
    locales: allLocale(filter: { language: { eq: $language } }) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }

    site {
      siteMetadata {
        title
        siteUrl
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
          year
          intro
          order
          color
          download_url
          cover_image {
            childImageSharp {
              gatsbyImageData(layout: FULL_WIDTH, placeholder: BLURRED)
            }
          }
          cover_caption
          cover_credit
        }
      }
    }

    posts: allFile(
      sort: { childMdx: { frontmatter: { order: ASC } } }
      filter: {
        extension: { eq: "mdx" }
        relativeDirectory: { eq: $postsDirectory }
        sourceInstanceName: { eq: "content" }
        childMdx: { fields: { locale: { eq: $language } } }
      }
    ) {
      nodes {
        relativePath
        relativeDirectory
        id
        childMdx {
          fields {
            slug
            locale
          }
          frontmatter {
            title
            order
            intro
            category
            eyebrow
            authors {
              frontmatter {
                name
              }
            }
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
    allSitePage {
      nodes {
        path
        pageContext
      }
    }
  }
`

const Issue = ({ data, pageContext, children, location }) => {
  const { t } = useTranslation()
  const translationData = { currentLanguage: pageContext.language, currentSlug: location.pathname }
  const translations = useTranslations(translationData, data.allSitePage.nodes)

  const coverImage = getImage(data.post.childMdx.frontmatter.cover_image)

  const postGroups = [
    'none',
    ...data.posts.nodes
      .map((el) => el.childMdx.frontmatter.category)
      .filter((el, i, arr) => {
        return el && arr.indexOf(el) === i
      }),
  ]

  const groupedPosts = []

  postGroups.forEach((group) => {
    const newGroup = { name: group, posts: [] }
    data.posts.nodes.forEach((node) => {
      const format = node.childMdx.frontmatter.category || 'none'
      if (format === group) {
        newGroup.posts.push(node)
      }
    })
    groupedPosts.push(newGroup)
  })

  const posts = groupedPosts.map((group) => {
    const postEls = group.posts.map((p) => {
      const year = data.post.relativeDirectory.replace(/(.{2})\/(issues)\//g, '')
      const frontmatter = p.childMdx.frontmatter
      const maxWords = 45
      let intro = ''
      if (frontmatter.teaser) {
        intro = frontmatter.teaser
      } else {
        intro =
          frontmatter.intro && frontmatter.intro.split(' ').length > maxWords
            ? frontmatter.intro.split(' ').slice(0, maxWords).join(' ') + '...'
            : frontmatter.intro
      }

      return (
        <li key={p.id}>
          <Link className={styles.postsItem} to={`/${year}/${p.childMdx.fields.slug}`}>
            {frontmatter.eyebrow && <span className={styles.postsEyebrow}>{frontmatter.eyebrow}</span>}
            <h3 className={styles.postsTitle}>{frontmatter.title}</h3>
            <div className={styles.postsIntro}>{frontmatter.intro && <MarkdownRenderer markdown={intro} />}</div>
            {frontmatter.authors && <div className={styles.postsMeta}> {frontmatter.authors.map((el) => el.frontmatter.name).join(', ')}</div>}
          </Link>
        </li>
      )
    })
    return (
      <li className={`${styles.postsGroup} ${group.name !== 'none' ? styles.postsGroupHasTitle : ''}`} key={`group-${group.name}`}>
        {group.name !== 'none' && <h2 className={styles.postsGroupTitle}>{group.name}</h2>}
        <ol>{postEls}</ol>
      </li>
    )
  })

  const termsPage = data.pages.nodes.find((node) => {
    return node.base === 'terms.mdx'
  })

  return (
    <App pages={data.pages.nodes} translationData={{ currentLanguage: pageContext.language, currentSlug: location.pathname }}>
      <SiteHeader issue={data.post} color="white" translationData={{ currentLanguage: pageContext.language, currentSlug: location.pathname }}>
        {termsPage && <Link to={`/${termsPage.childMdx.fields.slug}`}>{termsPage.childMdx.frontmatter.title}</Link>}
        <LanguageSwitcher translations={translations} translationData={translationData} />
      </SiteHeader>
      <main>
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <GatsbyImage className={styles.headerImage} image={coverImage} alt="" />
            <div className={styles.headerCopy}>
              <h1 className={styles.title}>{data.post.childMdx.frontmatter.title}</h1>
              <div className={styles.intro}>
                <MarkdownRenderer markdown={data.post.childMdx.frontmatter.intro} />
              </div>
            </div>
          </div>
          <aside className={styles.headerCaptions}>
            {data.post.childMdx.frontmatter.cover_caption && <p className={styles.headerCaption}>{data.post.childMdx.frontmatter.cover_caption}</p>}
            {data.post.childMdx.frontmatter.cover_credit && <p className={styles.headerCredit}>{data.post.childMdx.frontmatter.cover_credit}</p>}
          </aside>
        </header>
        <div className={styles.body}>
          <section className={styles.posts}>
            <h2 className={styles.sectionTitle}>{t('Contents')}</h2>
            <ol className={styles.postsList}>{posts}</ol>
          </section>
          <section className={styles.downloads}>
            <div className={styles.downloadsInner}>
              {data.post.childMdx.frontmatter.download_url && (
                <a rel="download" href={data.post.childMdx.frontmatter.download_url}>
                  <DownloadIcon />
                  {t('Download (PDF)')}
                </a>
              )}
            </div>
          </section>
          <AboutSection />
          <PartnerLogos />
        </div>
      </main>
      <Footer pages={data.pages.nodes} />
    </App>
  )
}

export default Issue

export const Head = ({ data, pageContext, location }) => {
  const year = data.post.relativeDirectory.replace(/(.{2})\/(issues)\//g, '')
  const translationData = { currentLanguage: pageContext.language, currentSlug: location.pathname }
  const { primary, dark, light, knockout } = useColors(data.post.childMdx.frontmatter.color)
  const bodyStyles = {
    '--fc-primary': primary.toString(),
    '--fc-dark': dark.toString(),
    '--fc-light': light.toString(),
    '--fc-knockout': knockout.toString(),
  }
  return (
    <>
      <body style={bodyStyles} />
      <Meta title={`${year} – ${data.site.siteMetadata.title}`} translationData={translationData} />
    </>
  )
}
