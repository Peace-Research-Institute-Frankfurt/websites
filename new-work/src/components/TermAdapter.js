import React, { useState } from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import Term from '@shared/components/Term'
import TooltipAdapter from './TooltipAdapter'
import * as styles from './Term.module.scss'
import MarkdownRenderer from 'react-markdown-renderer'

export default function TermAdapter({ t, children }) {
  const data = useStaticQuery(graphql`
    query TermQuery {
      terms: allTermsJson {
        nodes {
          term_id
          title
          description
        }
      }
    }
  `)

  const [isExpanded, setIsExanded] = useState(false)
  const maxWordCount = 25

  const termNode = data.terms.nodes.find((node) => {
    return node.term_id === t
  })

  if (!termNode) {
    console.log(`Could not find term: ${t}`)
    return <>{t}</>
  }

  const isTruncated = termNode.description.split(' ').length > maxWordCount
  const truncatedDescription = termNode.description.split(' ').slice(0, maxWordCount).join(' ') + '...'

  const description = (
    <>
      <MarkdownRenderer markdown={isExpanded || !isTruncated ? termNode.description : truncatedDescription} />
      {isTruncated && (
        <button
          onClick={() => {
            setIsExanded(!isExpanded)
          }}
          className={styles.more}
        >
          {isExpanded ? 'Weniger' : 'Mehr'}
        </button>
      )}
    </>
  )

  return (
    <>
      <Term term={termNode} description={description} TooltipAdapter={TooltipAdapter} styles={styles} children={children} />
    </>
  )
}
