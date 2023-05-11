import { Link, graphql, useStaticQuery } from 'gatsby'
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
  return (
    <footer >
      <p>© HSFK und die Autor*innen {new Date().getFullYear()}</p>
    </footer>
  )
}
