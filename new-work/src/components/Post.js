import React from 'react'
import { graphql } from 'gatsby'
import { GatsbyImage, getImage, getSrc } from 'gatsby-plugin-image'
import App from './App'
import PostBody from './PostBody'
import SkipToContent from './SkipToContent'
import StickyHeader from './StickyHeader'
import * as styles from './Post.module.scss'
import Meta from './Meta'
import PostHeader from './PostHeader'

export const query = graphql`
  query ($id: String!) {
    site: site {
      siteMetadata {
        title
      }
    }
    post: file(id: { eq: $id }) {
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
          hero_credit
          hero_image {
            childImageSharp {
              gatsbyImageData(layout: FULL_WIDTH, placeholder: BLURRED)
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

  let heroImage = <></>
  if (frontmatter.hero_image) {
    heroImage = <GatsbyImage loading="eager" image={getImage(frontmatter.hero_image)} alt={frontmatter.hero_alt} />
  }

  const next = data.posts.nodes[currentIndex + 1]
  const previous = data.posts.nodes[currentIndex - 1]

  return (
    <App className={`${frontmatter.category}`}>
      <SkipToContent />
      <article id="content" className={`${styles.container}`}>
        <PostHeader
          title={frontmatter.title}
          eyebrow={frontmatter.eyebrow || frontmatter.category}
          image={heroImage}
          credit={frontmatter.hero_credit}
          intro={frontmatter.intro}
        />
        <main className={styles.body}>
          <PostBody>{children}</PostBody>
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
