import React, { useState } from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import Term from '@shared/components/Term'
import TooltipAdapter from './TooltipAdapter'
import * as styles from './Term.module.scss'
import MarkdownRenderer from 'react-markdown-renderer'
import { useTranslation } from 'react-i18next'

export default function TermAdapter({ t, children }) {
  const data = useStaticQuery(graphql`
    query TermQuery {
      terms: allFile(filter: { sourceInstanceName: { eq: "content" }, extension: { eq: "mdx" }, relativeDirectory: { glob: "*/terms" } }) {
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
          }
        }
      }
    }
  `)

  const { i18n } = useTranslation()

  const termNode = data.terms.nodes
    .filter((node) => {
      return node.childMdx.fields.locale === i18n.language
    })
    .find((node) => {
      return node.childMdx.frontmatter.term_id === t
    })

  if (!termNode) {
    console.log(`Could not find term: ${t}`)
    return <>{t}</>
  }
  const description = <MarkdownRenderer markdown={termNode.childMdx.body} />

  return (
    <>
      <Term
        title={termNode.childMdx.frontmatter.title}
        term={termNode}
        description={description}
        TooltipAdapter={TooltipAdapter}
        styles={styles}
        children={children}
      />
    </>
  )
}
