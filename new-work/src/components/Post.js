import React from 'react'
import { graphql } from 'gatsby'
import { GatsbyImage, getImage, getSrc } from 'gatsby-plugin-image'
import Meta from './Meta'
import App from './App'
import StickyHeader from './StickyHeader'
import SkipToContent from './SkipToContent'
import PostHeader from './PostHeader'
import { Bylines } from './Bylines'
import { PostList } from './PostList'
import PostBody from './PostBody'

import PostHeaderVideo from './PostHeaderVideo'
import SearchForm from './SearchForm'
import FallbackIllustration from './FallbackIllustration'

import * as styles from './Post.module.scss'

export const query = graphql`
  query ($id: String!) {
    site: site {
      siteMetadata {
        title
      }
    }
    post: file(id: { eq: $id }) {
      id
      childMdx {
        fields {
          slug
        }
        frontmatter {
          title
          short_title
          intro
          order
          category
          hero_alt
          hero_portrait_alt
          hero_credits {
            label
            name
          }
          hide_body
          hero_image {
            childImageSharp {
              gatsbyImageData(layout: FULL_WIDTH, placeholder: BLURRED, breakpoints: [750, 1080, 1366, 1920, 2500])
            }
          }
          hero_video
          hero_portrait {
            childImageSharp {
              gatsbyImageData(layout: CONSTRAINED, placeholder: NONE, width: 500)
            }
          }
          authors {
            frontmatter {
              name
              author_id
              institution
              role
            }
            parent {
              ... on Mdx {
                body
              }
            }
          }
        }
      }
    }
    posts: allFile(filter: { extension: { eq: "mdx" }, sourceInstanceName: { eq: "posts" } }, sort: { childMdx: { frontmatter: { order: ASC } } }) {
      nodes {
        id
        childMdx {
          fields {
            slug
          }
          frontmatter {
            title
            short_title
            order
            intro
            title_prefix
            category
            format
            published_on
            authors {
              frontmatter {
                name
              }
            }
          }
        }
      }
    }
  }
`
const Post = ({ data, children }) => {
  const frontmatter = data.post.childMdx.frontmatter

  let heroImage = null
  if (frontmatter.hero_image) {
    heroImage = <GatsbyImage className={styles.heroImage} loading="eager" image={getImage(frontmatter.hero_image)} alt={frontmatter.hero_alt} />
  } else {
    heroImage = <FallbackIllustration category={frontmatter.category} />
  }
  let portraitImage = null
  if (frontmatter.hero_portrait) {
    portraitImage = (
      <GatsbyImage className={styles.heroPortrait} loading="eager" image={getImage(frontmatter.hero_portrait)} alt={frontmatter.hero_portrait_alt} />
    )
  }

const videoEl = frontmatter.hero_video ? <PostHeaderVideo src={frontmatter.hero_video} poster={heroImage} /> : null

  return (
    <App className={`${frontmatter.category}`}>
      <SkipToContent />
      <StickyHeader searchForm={<SearchForm />} post={data.post} />
      <article id="content" className={`${styles.container}`}>
        <PostHeader
          title={frontmatter.title}
          media={videoEl ? videoEl : heroImage}
          portrait={portraitImage}
          intro={frontmatter.intro}
          credits={frontmatter.hero_credits}
          hasIllustration={frontmatter.hero_image != null}
        />
        <main className={styles.body}>
          {!frontmatter.hide_body && (
            <>
              {frontmatter.authors && (
                <aside className={styles.credits}>
                  <Bylines authors={frontmatter.authors}></Bylines>
                </aside>
              )}
              <div className={styles.copy}>
                <PostBody>{children}</PostBody>
              </div>
            </>
          )}
          <nav className={styles.postsNav}>
            <PostList posts={data.posts.nodes} currentPostId={data.post.id} />
          </nav>
        </main>
      </article>
    </App>
  )
}

export function Head({ data }) {
  const frontmatter = data.post.childMdx.frontmatter
  return (
    <Meta
      title={`${frontmatter.title} – ${data.site.siteMetadata.title}`}
      description={frontmatter.intro}
      image={{ src: getSrc(frontmatter.hero_image), alt: frontmatter.hero_alt }}
    />
  )
}

export default Post