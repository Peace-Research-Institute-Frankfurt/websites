import React from 'react'
import { graphql, useStaticQuery, Link } from 'gatsby'
import Term from '@shared/components/Term'
import TooltipAdapter from './TooltipAdapter'
import slug from 'slug'
import * as styles from './Term.module.scss'

export default function TermAdapter({ t, ...props }) {
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

  const maxWordCount = 20

  const termNode = data.terms.nodes.find((node) => {
    return node.term_id === t
  })

  let copy = termNode.description
  let isTruncated = false
  if (termNode.description.split(' ').length > maxWordCount) {
    copy = termNode.description.split(' ').slice(0, maxWordCount).join(' ') + '...'
    isTruncated = true
  }

  const termData = {
    ...termNode,
    description: (
      <>
        <span>{copy}</span>
        {isTruncated && (
          <Link className={styles.more} to={`/terms#${slug(termNode.term_id)}`}>
            Mehr lesen
          </Link>
        )}
      </>
    ),
  }
  return <Term term={termData} TooltipAdapter={TooltipAdapter} styles={styles} {...props} />
}
