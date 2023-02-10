import TooltipAdapter from './TooltipAdapter'
import React, { useRef, useState } from 'react'
import * as styles from './TreatyParticipantGraph.module.scss'

export default function TreatyParticipantGraph({ treaty }) {
  const [tooltipActive, setTooltipActive] = useState(false)
  const [tooltipTarget, setTooltipTarget] = useState(null)
  const [tooltipText, setTooltipText] = useState('')
  const containerRef = useRef()

  function onMouseOver(e, p) {
    const status = p.events[p.events.length - 1].type
    let text = `${p.country.name.common}`
    const article = p.country.name.article ? `${p.country.name.article} ` : null
    if (status === 'ratification') {
      text = (
        <>
          {article}
          <strong>{p.country.name.common}</strong> signed the {treaty.shortTitle || treaty.title} on <time>{p.events[0].date}</time> and ratified it
          on <time>{p.events[1].date}</time>.
        </>
      )
    } else if (status === 'accession') {
      text = (
        <>
          {article}
          <strong>{p.country.name.common}</strong> acceeded to the {treaty.shortTitle || treaty.title} on <time>{p.events[0].date}</time>.
        </>
      )
    } else if (status === 'signature') {
      text = (
        <>
          {article}
          <strong>{p.country.name.common}</strong> signed the {treaty.shortTitle || treaty.title} on <time>{p.events[0].date}</time>, but has not
          ratified it.
        </>
      )
    } else if (status === 'succession' || status === 'approval' || status === 'acceptance') {
      text = (
        <>
          {article}
          <strong>{p.country.name.common}</strong> joined the {treaty.shortTitle || treaty.title} by {status} on <time>{p.events[0].date}</time>.
        </>
      )
    }
    setTooltipText(text)
    setTooltipActive(true)
    setTooltipTarget(e.target)
  }
  function onMouseOut(e) {
    setTooltipActive(false)
  }

  treaty.participants.sort((a, b) => {
    const dateA = new Date(a.events[a.events.length - 1].date)
    const dateB = new Date(b.events[b.events.length - 1].date)
    if (dateA > dateB) {
      return 1
    }
    if (dateA < dateB) {
      return -1
    }
    return 0
  })

  const countryEls = treaty.participants.map((p) => {
    const status = p.events[p.events.length - 1].type
    return (
      <li>
        <button
          key={p.country.cca2}
          onMouseOver={(e) => onMouseOver(e, p)}
          onFocus={(e) => onMouseOver(e, p)}
          onMouseOut={onMouseOut}
          onBlur={onMouseOut}
          aria-haspopup={true}
          data-status={status}
          className={`${styles.item} ${styles[status]}`}
        >
          {p.country.cca2}
        </button>
      </li>
    )
  })
  return (
    <div className={styles.container} ref={containerRef}>
      <ul className={styles.items}>{countryEls}</ul>
      {treaty.scrapeURL && (
        <p className={styles.source}>
          Data: <a href={treaty.scrapeURL}>United Nations Treaty Collection</a>
        </p>
      )}
      <TooltipAdapter active={tooltipActive} targetEl={tooltipTarget} position="topCenter">
        <span className={styles.tooltipContent}>{tooltipText}</span>
      </TooltipAdapter>
    </div>
  )
}
