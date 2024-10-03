import { graphql } from 'gatsby'
import React from 'react'
import App from './App'
import StickyHeader from './StickyHeader'
import SkipToContent from './SkipToContent'
import PageHeader from './PageHeader'
import SearchForm from './SearchForm'
import PostBody from './PostBody'

import * as styles from './Page.module.scss'

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
      <StickyHeader searchForm={<SearchForm />} />
      <main id="content" className={styles.container}>
        <PageHeader intro={frontmatter.intro} title={frontmatter.title} />
        <div className={styles.body}>
          <PostBody>{children}</PostBody>
        </div>
      </main>
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
