import React from 'react'
import { graphql } from 'gatsby'
import Balancer from 'react-wrap-balancer'
import App from './App'
import Meta from './Meta'
import PostBody from './PostBody'
import StickyHeader from './StickyHeader'

import * as styles from './Chapter.module.scss'

export const query = graphql`
  query ($id: String) {
    site: site {
      siteMetadata {
        title
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
  }
`

const Page = ({ data, children }) => {
  const frontmatter = data.post.childMdx.frontmatter

  return (
    <App>
      <StickyHeader post={data.post} />
      <article id="content">
        <header className={styles.header}>
          <div className={styles.headerCopy}>
            <h1 className={styles.title}>
              <Balancer>{frontmatter.title}</Balancer>
            </h1>
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
