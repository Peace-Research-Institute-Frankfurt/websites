import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { useTranslation } from 'react-i18next'
import MarkdownRenderer from 'react-markdown-renderer'
import * as styles from './TermsList.module.scss'

const TermsList = () => {
  const data = useStaticQuery(graphql`
    query TermsListQuery {
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
            }
          }
        }
      }
    }
  `)

  const { i18n } = useTranslation()

  const localTerms = data.terms.nodes.filter((node) => {
    return node.childMdx.fields.locale === i18n.language
  })

  let initials = []

  localTerms.forEach((node) => {
    const initial = node.childMdx.frontmatter.title.slice(0, 1).toLowerCase()
    if (!initials.includes(initial)) {
      initials.push(initial)
    }
  })

  const groupedTerms = initials
    .map((initial) => {
      const terms = localTerms
        .filter((node) => {
          return node.childMdx.frontmatter.title.slice(0, 1).toLowerCase() === initial
        })
        .sort((a, b) => {
          const na = a.childMdx.frontmatter
          const nb = b.childMdx.frontmatter
          if (na.title.toLowerCase() < nb.title.toLowerCase()) {
            return -1
          }
          if (na.title.toLowerCase() > nb.title.toLowerCase()) {
            return 1
          }
          return 0
        })
      return {
        letter: initial,
        terms: terms,
      }
    })
    .sort((a, b) => {
      return a.letter > b.letter ? 1 : -1
    })

  return (
    <ol className={styles.container}>
      {groupedTerms.map((group) => {
        return (
          <li className={styles.group}>
            <h2 className={styles.letter}>{group.letter}</h2>
            <dl className={styles.terms}>
              {group.terms.map((node) => {
                return (
                  <div className={styles.term}>
                    <dt className={styles.title}>{node.childMdx.frontmatter.title}</dt>
                    <dd className={styles.description}>
                      <MarkdownRenderer markdown={node.childMdx.body} />
                    </dd>
                  </div>
                )
              })}
            </dl>
          </li>
        )
      })}
    </ol>
  )
}

export default TermsList
