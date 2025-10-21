import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { useTranslation } from 'react-i18next'
import MarkdownRenderer from 'react-markdown-renderer'
import * as styles from './TermsList.module.scss'

const TermsList = ({ year }) => {
  const data = useStaticQuery(graphql`
    query TermsListQuery {
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

  const { i18n } = useTranslation()

  // Nur die aktuelle Sprache
  const localTerms = data.terms.nodes.filter(
    (node) =>
      node.childMdx.fields.locale === i18n.language &&
      (!year || node.childMdx.parent.relativeDirectory.includes(year))
  )

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
        .filter((node) => node.childMdx.frontmatter.title.slice(0, 1).toLowerCase() === initial)
        .sort((a, b) => {
          const na = a.childMdx.frontmatter
          const nb = b.childMdx.frontmatter
          return na.title.toLowerCase() < nb.title.toLowerCase() ? -1 : na.title.toLowerCase() > nb.title.toLowerCase() ? 1 : 0
        })
      return {
        letter: initial,
        terms: terms,
      }
    })
    .sort((a, b) => (a.letter > b.letter ? 1 : -1))

  return (
    <ol className={styles.container}>
      {groupedTerms.map((group) => (
        <li className={styles.group} key={group.letter}>
          <h2 className={styles.letter}>{group.letter}</h2>
          <dl className={styles.terms}>
            {group.terms.map((node) => (
              <div className={styles.term} key={node.id}>
                <dt className={styles.title}>{node.childMdx.frontmatter.title}</dt>
                <dd className={styles.description}>
                  <MarkdownRenderer markdown={node.childMdx.body} />
                </dd>
              </div>
            ))}
          </dl>
        </li>
      ))}
    </ol>
  )
}

export default TermsList
