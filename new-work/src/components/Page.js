import { graphql } from 'gatsby'
import React from 'react'
import App from './App'
import PostBody from './PostBody'
import PostHeader from './PostHeader'
import SkipToContent from './SkipToContent'
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
      modifiedTime(locale: "de-DE", formatString: "dddd, D.M.YYYY")
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
`
const Page = ({ data, children }) => {
  const frontmatter = data.post.childMdx.frontmatter
  return (
    <App>
      <SkipToContent />
      <article id="content">
        <PostHeader title={frontmatter.title} />
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
    <>
      <title>{`${frontmatter.title} – New Work (Eine Anleitung)`}</title>
      <meta name="description" content={`${frontmatter.intro}`} />
    </>
  )
}

export default Page
