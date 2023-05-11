import React from 'react'
import { Link, graphql } from 'gatsby'
import App from '../components/App'
import Meta from '../components/Meta'
import SkipToContent from '../components/SkipToContent'

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
          }
        }
      }
    }
  }
`

const Index = ({ data }) => {
  return (
    <App>
      <SkipToContent />
      <main id="content">
        <h1>PRIF Review</h1>
        {data.posts.nodes.map((p) => {
          return <Link to={p.childMdx.fields.slug}>{p.childMdx.frontmatter.title}</Link>
        })}
      </main>
    </App>
  )
}

export default Index
export const Head = ({ data }) => <Meta />
