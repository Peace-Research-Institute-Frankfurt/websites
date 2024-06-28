import React, { useState } from 'react'
import { graphql } from 'gatsby'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import { MDXProvider } from '@mdx-js/react'
import MarkdownRenderer from 'react-markdown-renderer'
import App from '../components/App'
import Meta from '../components/Meta'
import SkipToContent from '../components/SkipToContent'
import Leadin from './Leadin'
import { useTranslation } from 'gatsby-plugin-react-i18next'
import { Link } from 'gatsby-plugin-react-i18next'
import useColors from '../hooks/useColors.js'
import { Person, PersonList } from './Person'
import Arrow from '../images/arrow-right.svg'
import DownloadIcon from '../images/download.svg'
import * as styles from './Report.module.scss'

export const query = graphql`
  query ($id: String!, $language: String!, $postsDirectory: String!, $creditsNode: String!) {
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
          intro
          color
          order
          cover_image {
            childImageSharp {
              gatsbyImageData(width: 1200, layout: FULL_WIDTH, placeholder: NONE)
            }
          }
          download_url
          authors {
            name
            image
            image_alt
            bio
          }
        }
      }
    }

    credits: file(id: { eq: $creditsNode }) {
      relativeDirectory
      childMdx {
        body
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
            teaser
            color
            eyebrow
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
  }
`

const Index = ({ data, pageContext, children, location }) => {
  const frontmatter = data.post.childMdx.frontmatter
  const year = data.post.relativeDirectory.replace(/(.{2})\/(reports)\//g, '')

  const coverImage = getImage(frontmatter.cover_image)

  const [introCollapsed, setIntroCollapsed] = useState(true)
  const { t } = useTranslation()

  const shortCodes = {
    Leadin,
    Person,
    PersonList,
  }

  const posts = data.posts.nodes.map((p) => {
    let postStyles = {}
    const year = data.post.relativeDirectory.replace(/(.{2})\/(reports)\//g, '')
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
        <Link style={postStyles} className={styles.post} to={`/${year}/${p.childMdx.fields.slug}`}>
          {frontmatter.eyebrow && <span className={styles.postEyebrow}>{frontmatter.eyebrow}</span>}
          <h3 className={styles.postTitle}>{frontmatter.title}</h3>
          {frontmatter.intro && (
            <div className={styles.postIntro}>
              <MarkdownRenderer markdown={intro} />
            </div>
          )}
        </Link>
      </li>
    )
  })
  return (
    <App pages={data.pages.nodes} translationData={{ currentLanguage: pageContext.language, currentSlug: location.pathname }}>
      <SkipToContent />
      <main>
        <header className={styles.header}>
          <GatsbyImage className={styles.headerImage} image={coverImage} alt="" />
          <div className={styles.headerInner}>
            <h1 className={styles.title}>
              {data.post.childMdx.frontmatter.title}
              <span>{year}</span>
            </h1>
          </div>
        </header>

        <section className={`${styles.intro} ${introCollapsed ? styles.collapsed : ''}`}>
          <h2 className={styles.sectionTitle}>{t('Editorial')}</h2>
          <div className={styles.introInner}>
            <MDXProvider components={shortCodes}>{children}</MDXProvider>
          </div>
          <button
            className={styles.introToggle}
            onClick={() => {
              setIntroCollapsed(!introCollapsed)
            }}
          >
            {introCollapsed ? t('Read more') : t('Less')}
            <Arrow />
          </button>
          {data.post.childMdx.frontmatter.authors && (
            <div className={styles.introAuthors}>
              <PersonList>
                {data.post.childMdx.frontmatter.authors.map((person, i) => {
                  return (
                    <Person key={`person.${i}`} name={person.name} image={person.image}>
                      {person.bio}
                    </Person>
                  )
                })}
              </PersonList>
            </div>
          )}
        </section>
        <section className={styles.posts}>
          <h2 className={styles.sectionTitle}>{t('Contents')}</h2>
          <ol className={styles.postsList}>{posts}</ol>
          <aside className={styles.sidebar}>
            {data.post.childMdx.frontmatter.download_url && (
              <a className={styles.download} download href={data.post.childMdx.frontmatter.download_url}>
                <DownloadIcon />
                <span className={styles.downloadLabel}>{t('Download full report in PDF format')}</span>
              </a>
            )}
            {data.credits && (
              <div className={styles.credits}>
                <h2>{t('Credits')}</h2>
                <MarkdownRenderer markdown={data.credits.childMdx.body} />
              </div>
            )}
          </aside>
        </section>
      </main>
    </App>
  )
}

export default Index

export const Head = ({ data, pageContext, location }) => {
  const year = data.post.relativeDirectory.replace(/(.{2})\/(reports)\//g, '')
  const translationData = { currentLanguage: pageContext.language, currentSlug: location.pathname }
  const { text, background, knockout } = useColors(data.post.childMdx.frontmatter.color || 'black')

  const bodyStyles = {
    '--fc-text': text.toString(),
    '--fc-background': background.toString(),
    '--fc-knockout': knockout.toString(),
    '--logo-primary': 'var(--prif-blue-dark)',
    '--logo-secondary': 'var(--prif-blue-light)',
  }
  return (
    <>
      <body style={bodyStyles} />
      <Meta title={`${year} – ${data.site.siteMetadata.title}`} translationData={translationData} />
    </>
  )
}
