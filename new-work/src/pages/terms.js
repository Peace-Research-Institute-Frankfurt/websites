import React, { useEffect, useState } from 'react'
import slug from 'slug'
import { graphql } from 'gatsby'
import App from '../components/App'
import Meta from '../components/Meta'
import SkipToContent from '../components/SkipToContent'
import PageHeader from '../components/PageHeader'
import * as styles from './terms.module.scss'

export const query = graphql`
  query {
    terms: allTermsJson {
      nodes {
        title
        description
        term_id
      }
    }
  }
`

const Index = ({ data }) => {
  let initials = []
  const [currentLetter, setCurrentLetter] = useState(null)
  const [activeTerms, setActiveTerms] = useState([])

  useEffect(() => {
    if (window.location.hash) {
      const hash = window.location.hash.slice(1)
      const term = data.terms.nodes.find((el) => {
        return slug(el.term_id) === hash
      })
      if (term) {
        setActiveTerms((prev) => {
          return [...prev, term.term_id]
        })
      }
    }
  }, [data.terms.nodes])

  data.terms.nodes.forEach((node) => {
    const initial = node.title.slice(0, 1)
    if (!initials.includes(initial)) {
      initials.push(initial)
    }
  })

  const sortedTerms = data.terms.nodes.sort((a, b) => {
    if (a.title.toLowerCase() < b.title.toLowerCase()) {
      return -1
    }
    if (a.title.toLowerCase() > b.title.toLowerCase()) {
      return 1
    }
    return 0
  })

  const initialEls = initials.sort().map((el, i) => {
    return (
      <li key={`initial-${el}`}>
        <button
          onClick={() => {
            if (el === currentLetter) {
              setCurrentLetter(null)
            } else {
              setCurrentLetter(el)
            }
          }}
          className={`${styles.initial} ${el === currentLetter ? styles.active : ''}`}
        >
          {el}
        </button>
      </li>
    )
  })

  const termsEls = sortedTerms
    .filter((el) => {
      if (currentLetter) {
        return currentLetter === el.title.slice(0, 1)
      }
      return true
    })
    .map((node, i) => {
      return (
        <li key={`term-${i}`}>
          <details id={slug(node.term_id)} className={styles.term} open={activeTerms.includes(node.term_id)}>
            <summary
              onClick={(e) => {
                e.preventDefault()
                if (activeTerms.includes(node.term_id)) {
                  setActiveTerms((prev) => {
                    return prev.filter((el) => el !== node.term_id)
                  })
                } else {
                  setActiveTerms((prev) => {
                    return [...prev, node.term_id]
                  })
                }
              }}
              className={styles.termTitle}
            >
              {node.title}
            </summary>
            <div className={styles.termDescription}>{node.description}</div>
          </details>
        </li>
      )
    })

  return (
    <App>
      <SkipToContent />
      <main id="content" className={styles.container}>
        <PageHeader
          title="Glossar"
          intro="Our existing learning units include a series of interactive graphics produced by an external agency. These can be embedded in new learning units and should behave as expected."
        />
        <section className={styles.content}>
          <ol className={styles.initials}>{initialEls}</ol>
          <ol className={styles.terms}>{termsEls}</ol>
        </section>
      </main>
    </App>
  )
}

export default Index
export const Head = ({ data }) => <Meta />
