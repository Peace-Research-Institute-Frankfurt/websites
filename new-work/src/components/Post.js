import React from 'react'
import { graphql } from 'gatsby'
import { GatsbyImage, getImage, getSrc } from 'gatsby-plugin-image'
import App from './App'
import Meta from './Meta'
import SkipToContent from './SkipToContent'
import PostBody from './PostBody'
import PostHeader from './PostHeader'
import Bylines from './Bylines'
import { PostList, PostListItem } from './PostList'
import MarkdownRenderer from 'react-markdown-renderer'
import StickyHeader from './StickyHeader'

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
          intro
          color
          order
          eyebrow
          reading_time
          category
          hero_alt
          hero_portrait_alt
          hero_credit
          hero_image {
            childImageSharp {
              gatsbyImageData(layout: FULL_WIDTH, placeholder: BLURRED)
            }
          }
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
              twitter
              image {
                childImageSharp {
                  gatsbyImageData(placeholder: NONE, width: 100, layout: CONSTRAINED)
                }
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
            order
            intro
            color
            category
          }
        }
      }
    }
  }
`
const Post = ({ data, children }) => {
  const frontmatter = data.post.childMdx.frontmatter
  const currentIndex = data.posts.nodes.findIndex((el) => {
    return el.childMdx.frontmatter.order === frontmatter.order
  })

  let heroImage = null
  if (frontmatter.hero_image) {
    heroImage = <GatsbyImage loading="eager" image={getImage(frontmatter.hero_image)} alt={frontmatter.hero_alt} />
  }
  let portraitImage = null
  if (frontmatter.hero_portrait) {
    portraitImage = (
      <GatsbyImage className={styles.heroPortrait} loading="eager" image={getImage(frontmatter.hero_portrait)} alt={frontmatter.hero_portrait_alt} />
    )
  }

  const posts = data.posts.nodes.map((node) => {
    const fm = node.childMdx.frontmatter
    return (
      <li key={`post-${node.id}`}>
        <PostListItem isCurrent={node.id === data.post.id} title={fm.title} category={fm.category} slug={node.childMdx.fields.slug} />
      </li>
    )
  })

  const next = data.posts.nodes[currentIndex + 1]
  const previous = data.posts.nodes[currentIndex - 1]

  return (
    <App className={`${frontmatter.category}`}>
      <SkipToContent />
      <StickyHeader post={data.post} />
      <article id="content" className={`${styles.container}`}>
        <PostHeader
          title={frontmatter.title}
          eyebrow={frontmatter.eyebrow || frontmatter.category}
          image={heroImage}
          portrait={portraitImage}
          credit={frontmatter.hero_credit}
          intro={frontmatter.intro}
        />
        <main className={styles.body}>
          <aside className={styles.credits}>
            <Bylines authors={frontmatter.authors}></Bylines>
            {frontmatter.hero_credit && (
              <aside className={styles.credit}>
                <MarkdownRenderer markdown={frontmatter.hero_credit} />
              </aside>
            )}
          </aside>
          <div className={styles.copy}>
            <PostBody>{children}</PostBody>
          </div>
          <nav className={styles.postsNav}>
            <PostList>{posts}</PostList>
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
