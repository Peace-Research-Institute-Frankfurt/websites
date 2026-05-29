import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import Term from '@shared/components/Term'
import TooltipAdapter from './TooltipAdapter'
import * as styles from './Term.module.scss'
import MarkdownRenderer from 'react-markdown-renderer'
import { useI18next } from 'gatsby-plugin-react-i18next'

export default function TermAdapter({ t, year, children }) {
  const data = useStaticQuery(graphql`
    query TermQuery {
      terms: allFile(
        filter: {
          sourceInstanceName: { eq: "content" }
          extension: { eq: "mdx" }
          relativeDirectory: { glob: "**/terms/**" }
        }
      ) {
        nodes {
          id
          childMdx {
            body
            fields {
              slug
              locale
            }
            frontmatter {
              title
              term_id
            }
            parent {
              ... on File {
                relativeDirectory
              }
            }
          }
        }
      }
    }
  `)

 const { language } = useI18next()

  // Filter nach Sprache und optional nach Jahr
  const termNode = data.terms.nodes
      .filter((node) => node.childMdx.fields.locale === language)
    .filter((node) => !year || node.childMdx.parent.relativeDirectory.includes(year))
    .find((node) => node.childMdx.frontmatter.term_id === t)

  if (!termNode) {
    console.log(`Could not find term: ${t}`)
    return <>{t}</>
  }

  const description = <MarkdownRenderer markdown={termNode.childMdx.body} />

  return (
    <Term
      title={termNode.childMdx.frontmatter.title}
      term={termNode}
      description={description}
      TooltipAdapter={TooltipAdapter}
      styles={styles}
    >
      {children}
    </Term>
  )
}
