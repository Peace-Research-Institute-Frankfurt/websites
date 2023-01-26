import React, { useState, useRef } from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import * as styles from './Term.module.scss'
import Tooltip from './Tooltip'
import CloseIcon from '../assets/close.svg'

export default function Term(props) {
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

  const [active, setActive] = useState(false)
  const triggerRef = useRef()
  // Let's find our term
  let term = null
  data.terms.nodes.forEach((t) => {
    if (t.term_id === props.t) {
      term = t
    }
  })

  function toggleTooltip() {
    setActive(!active)
  }

  if (term) {
    return (
      <>
        <button type="button" ref={triggerRef} onClick={toggleTooltip} className={styles.container}>
          {props.children ? <>{props.children}</> : <>{term.term_id}</>}
        </button>
        <Tooltip position="top-center" active={active} triggerEl={triggerRef.current}>
          <span className={styles.content}>
            <span className={styles.header}>
              <em className={styles.title}>{term.title}</em>
              <button onClick={toggleTooltip} role="button" className={styles.close}>
                Close
                <CloseIcon />
              </button>
            </span>
            <span className={styles.description}>{term.description}</span>
          </span>
        </Tooltip>
      </>
    )
  } else {
    return <>{props.t}</>
  }
}
