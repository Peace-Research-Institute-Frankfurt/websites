import React from 'react'
import { Link, graphql } from 'gatsby'
import Meta from '../components/Meta'
import * as styles from './index.module.scss'

export const query = graphql`
  query {
    site: site {
      siteMetadata {
        title
      }
    }
    units: allFile(
      filter: { extension: { eq: "mdx" }, name: { eq: "index" }, sourceInstanceName: { eq: "luContent" } }
      sort: { childMdx: { frontmatter: { order: ASC } } }
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

const IndexPage = ({ data }) => {
  const units = data.units.nodes.map((node, i) => {
    return (
      <li key={`unit-${i}`}>
        <Link className={styles.item} to={node.childMdx.fields.slug}>
          {node.childMdx.frontmatter.order}. {node.childMdx.frontmatter.title}
        </Link>
      </li>
    )
  })

  return (
    <main className={styles.container}>
      <div className={styles.inner}>
        <h1>EUNPDC E-Learning</h1>
        <p className={styles.note}>
          Hi! This is a temporary index page intended for development purposes only. It will be replaced by{' '}
          <a href="https://nonproliferation-elearning.eu/">nonproliferation-elearning.eu</a> in production.
        </p>
        {process.env.NODE_ENV === 'development' && <ol className={styles.list}>{units}</ol>}
      </div>
    </main>
  )
}

export function Head({ data }) {
  return <Meta />
}

export default IndexPage
