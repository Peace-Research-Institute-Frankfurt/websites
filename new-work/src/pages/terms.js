import React, { useState } from 'react'
import { Link, graphql } from 'gatsby'
import App from '../components/App'
import Meta from '../components/Meta'
import SkipToContent from '../components/SkipToContent'
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
  data.terms.nodes.forEach((node) => {
    const initial = node.title.slice(0, 1)
    if (!initials.includes(initial)) {
      initials.push(initial)
    }
  })

  initials.sort()

  const sortedTerms = data.terms.nodes.sort((a, b) => {
    if (a.title.toLowerCase() < b.title.toLowerCase()) {
      return -1
    }
    if (a.title.toLowerCase() > b.title.toLowerCase()) {
      return 1
    }
    return 0
  })

  const terms = sortedTerms
    .filter((el) => {
      if (currentLetter) {
        return currentLetter === el.title.slice(0, 1)
      }
      return true
    })
    .map((node, i) => {
      return (
        <li key={`term-${i}`}>
          <details className={styles.term}>
            <summary className={styles.termTitle}>{node.title}</summary>
            <div className={styles.termDescription}>{node.description}</div>
          </details>
        </li>
      )
    })
  const initialEls = initials.map((el, i) => {
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
  return (
    <App>
      <SkipToContent />
      <main id="content" className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.headerTitle}>Glossar</h1>
          <div className={styles.headerCopy}>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat minus earum laudantium, blanditiis commodi voluptatum et eius velit
              error, unde pariatur doloremque quas? Vitae perferendis, alias perspiciatis recusandae consequatur ipsum?
            </p>
          </div>
        </header>
        <section className={styles.content}>
          <ol className={styles.initials}>{initialEls}</ol>
          <ol className={styles.terms}>{terms}</ol>
        </section>
      </main>
    </App>
  )
}

export default Index
export const Head = ({ data }) => <Meta />
