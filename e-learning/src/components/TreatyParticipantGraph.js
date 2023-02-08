import React, { useRef, useState } from 'react'
import * as styles from './TreatyParticipantGraph.module.scss'
import { clamp } from './utils'

export default function TreatyParticipantGraph({ treaty }) {
  const [tooltipActive, setTooltipActive] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [tooltipText, setTooltipText] = useState('')
  const containerRef = useRef()
  const tooltipRef = useRef()

  function onMouseOver(e, p) {
    const { x, y, width } = e.target.getBoundingClientRect()
    const status = p.events[p.events.length - 1].type
    setTooltipActive(true)
    let text = `${p.country.name.common}`
    if (status === 'ratification') {
      text = (
        <>
          <strong>{p.country.name.common}</strong> signed the {treaty.shortTitle || treaty.title} on <time>{p.events[0].date}</time> and ratified it
          on <time>{p.events[1].date}</time>.
        </>
      )
    } else if (status === 'accession') {
      text = (
        <>
          <strong>{p.country.name.common}</strong> acceeded to the {treaty.shortTitle || treaty.title} on <time>{p.events[0].date}</time>.
        </>
      )
    } else if (status === 'signature') {
      text = (
        <>
          <strong>{p.country.name.common}</strong> signed the {treaty.shortTitle || treaty.title} on <time>{p.events[0].date}</time>, but has not
          ratified it.
        </>
      )
    } else if (status === 'succession' || status === 'approval' || status === 'acceptance') {
      text = (
        <>
          <strong>{p.country.name.common}</strong> joined the {treaty.shortTitle || treaty.title} by {status} on <time>{p.events[0].date}</time>.
        </>
      )
    }
    setTooltipText(text)
    const tr = tooltipRef.current.getBoundingClientRect()
    const padding = 15
    setTooltipPosition({
      x: clamp(padding + tr.width / 2, x + width / 2, window.innerWidth - tr.width / 2 - padding),
      y: clamp(tr.height + 100, y, window.innerHeight),
    })
  }
  function onMouseOut(e) {
    setTooltipActive(false)
  }

  const countryEls = treaty.participants.map((p) => {
    const status = p.events[p.events.length - 1].type
    return (
      <li
        key={p.country.cca2}
        onMouseOver={(e) => onMouseOver(e, p)}
        onMouseOut={onMouseOut}
        data-status={status}
        className={`${styles.item} ${styles[status]}`}
      >
        {p.country.cca2}
      </li>
    )
  })
  return (
    <div className={styles.container} ref={containerRef}>
      <ul className={styles.items}>{countryEls}</ul>
      {treaty.participantsSource && (
        <p className={styles.source}>
          Data: <a href={treaty.participantsSource}>United Nations Treaty Collection</a>
        </p>
      )}
      <div
        ref={tooltipRef}
        className={`${styles.tooltip} ${tooltipActive ? styles.tooltipActive : null}`}
        style={{
          transform: `translateX(${tooltipPosition.x}px) translateY(${tooltipPosition.y}px) translateY(-100%) translateY(-5px) translateX(-50%)`,
        }}
      >
        {tooltipText}
      </div>
    </div>
  )
}
