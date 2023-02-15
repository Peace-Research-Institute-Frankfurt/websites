import { Link, graphql } from 'gatsby'
import { StaticImage } from 'gatsby-plugin-image'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import React from 'react'
import App from '../components/App'
import Meta from '../components/Meta'
import SkipToContent from '../components/SkipToContent'
import { gri } from '../components/util'
import LeibnizLogo from '../images/logo-black.svg'
import * as styles from './index.module.scss'

export const query = graphql`
  query {
    posts: allFile(filter: { extension: { eq: "mdx" }, sourceInstanceName: { eq: "posts" } }, sort: { childMdx: { frontmatter: { order: ASC } } }) {
      nodes {
        id
        childMdx {
          fields {
            slug
          }
          frontmatter {
            title
            order
            intro
            authors {
              frontmatter {
                name
                author_id
                image {
                  childImageSharp {
                    gatsbyImageData(placeholder: NONE, width: 70, layout: CONSTRAINED)
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`

const Index = ({ data }) => {
  const posts = data.posts.nodes.map((node, i) => {
    const fm = node.childMdx.frontmatter
    let byline = ''
    if (fm.authors) {
      byline = fm.authors.map((a, j) => {
        const authorImage = getImage(a.frontmatter.image)
        const imageStyles = {
          transform: `translateX(${100 * j}%) rotate(${gri(-20, 20)}deg)`,
        }
        return (
          <li style={imageStyles} key={`authors-${i}-${a.frontmatter.author_id}-${j}`}>
            <GatsbyImage objectFit="contain" className={styles.bylineImage} image={authorImage} alt={`${a.frontmatter.name} profile image`} />
          </li>
        )
      })
    }
    return (
      <li key={`post-${i}`}>
        <Link className={styles.postsItem} to={node.childMdx.fields.slug}>
          <div className={styles.postsHeader}>
            <h2 className={styles.postsTitle}>{fm.title}</h2>
            <ul className={styles.postsAuthors}>{byline}</ul>
          </div>
          <p className={styles.postsIntro}>{fm.intro}</p>
        </Link>
      </li>
    )
  })
  return (
    <App>
      <SkipToContent />
      <main id="content">
        <header role="banner" className={styles.hero}>
          <h1 className={styles.title}>
            <div>
              <span className={styles.titleMain}>
                <span className={styles.w}>W</span>
                <span className={styles.o}>o</span>
                <span>r</span>
                <span>k</span>
                <span> </span>
                <span>N</span>
                <span className={styles.e}>e</span>
                <span className={styles.w}>w</span>
              </span>
            </div>
            <div className={styles.tagline}>
              <p>Wie wir Räume, Kulturen und Netzwerke für die Zukunft gestalten</p>
            </div>
            <span className={styles.titleSecondary}>
              <span className={styles.at}>@</span>Leibniz
            </span>
          </h1>
          <StaticImage
            imgStyle={{ objectFit: 'contain' }}
            placeholder="none"
            layout="constrained"
            className={styles.face}
            loading="eager"
            src="../images/leibniz-head.png"
            alt=""
            width={1000}
          />
          <a href="https://www.leibniz-gemeinschaft.de/" className={styles.sticker}>
            <LeibnizLogo />
          </a>
        </header>
        <section className={styles.content}>
          <ol className={styles.posts}>{posts}</ol>
        </section>
      </main>
    </App>
  )
}

export default Index
export const Head = ({ data }) => <Meta />
