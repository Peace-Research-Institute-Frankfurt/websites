import React from 'react'
import { graphql } from 'gatsby'
import { GatsbyImage, getImage, getSrc } from 'gatsby-plugin-image'
import App from './App'
import PostBody from './PostBody'
import PostHeader from './PostHeader'
import Pagination from './PostPagination'
import SkipToContent from './SkipToContent'
import StickyHeader from './StickyHeader'
import * as styles from './Post.module.scss'
import Meta from './Meta'

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
          reading_time
          hero_alt
          hero_credit
          hero_image {
            childImageSharp {
              gatsbyImageData(width: 1000, placeholder: BLURRED)
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

  const heroImage = (
    <div className={styles.image}>
      <GatsbyImage loading="eager" image={getImage(frontmatter.hero_image)} alt={frontmatter.hero_alt} />
      {frontmatter.hero_credit && <p className={styles.credit}>Bild: {frontmatter.hero_credit}</p>}
    </div>
  )

  const next = data.posts.nodes[currentIndex + 1]
  const previous = data.posts.nodes[currentIndex - 1]

  return (
    <App>
      <SkipToContent />
      <StickyHeader title={frontmatter.title} chapterIndex={frontmatter.order} next={next} prev={previous} post={data.post} />
      <article id="content">
        <PostHeader
          authors={frontmatter.authors}
          readingTime={frontmatter.reading_time}
          intro={frontmatter.intro}
          image={heroImage}
          title={frontmatter.title}
          fullHeight={true}
          color={frontmatter.color}
        />
        <main className={styles.body}>
          <PostBody>{children}</PostBody>
          <Pagination next={next} previous={previous} />
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
