import React from 'react'
import { graphql } from 'gatsby'
import App from '../components/App'
import Meta from '../components/Meta'
import SkipToContent from '../components/SkipToContent'
import { Link, useTranslation } from 'gatsby-plugin-react-i18next'

export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: { language: { eq: $language } }) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
    posts: allFile(
      filter: { extension: { eq: "mdx" }, sourceInstanceName: { eq: "posts" }, childMdx: { fields: { locale: { eq: $language } } } }
      sort: { childMdx: { frontmatter: { order: ASC } } }
    ) {
      nodes {
        id
        childMdx {
          fields {
            slug
            locale
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
  const { t } = useTranslation()
  return (
    <App>
      <SkipToContent />
      <main id="content">
        <h1>{t('Home')}</h1>
        {data.posts.nodes.map((p) => {
          return <Link to={`/${p.childMdx.fields.slug}`}>{p.childMdx.frontmatter.title}</Link>
        })}
      </main>
    </App>
  )
}

export default Index
export const Head = ({ data }) => <Meta />
