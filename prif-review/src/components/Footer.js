import { graphql, useStaticQuery } from 'gatsby'
import { Link, useTranslation } from 'gatsby-plugin-react-i18next'
import React from 'react'
export default function Footer() {
  const data = useStaticQuery(graphql`
    query {
      meta: site {
        buildTime(formatString: "D MMMM Y, HH:mm", locale: "de")
      }
      pages: allFile(filter: { extension: { eq: "mdx" }, sourceInstanceName: { eq: "pages" } }, sort: { childMdx: { frontmatter: { order: ASC } } }) {
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
  `)
  const { t } = useTranslation()
  return (
    <footer>
      <nav>
        <ul>
          <li>
            <Link to="/">Startseite</Link>
          </li>
          {data.pages.nodes.map((p) => {
            return (
              <li key={`navitem-${p.id}`}>
                <Link to={`../${p.childMdx.fields.slug}`}>{p.childMdx.frontmatter.title}</Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <p>
        {t('PRIF and the authors')} {new Date().getFullYear()}
      </p>
    </footer>
  )
}
