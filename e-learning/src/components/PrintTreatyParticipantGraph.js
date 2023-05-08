import React from 'react'
import * as styles from './PrintTreatyParticipantGraph.module.scss'

const PrintTreatyParticipantGraph = function ({ treaty }) {
  const sortOrder = ['ratification', 'accession', 'acceptance', 'succession', 'signature', 'none']
  treaty.participants.sort((a, b) => {
    const dateA = sortOrder.indexOf(a.status)
    const dateB = sortOrder.indexOf(b.status)
    if (dateA > dateB) {
      return 1
    }
    if (dateA < dateB) {
      return -1
    }
    return 0
  })

  const colCount = 12
  const rowCount = Math.ceil(treaty.participants.length / colCount)
  const boxHeight = 15
  const strokeWidth = 0.5
  const width = 284
  const padding = 4
  const height = rowCount * boxHeight
  const countryEls = treaty.participants.map((p, i) => {
    const status = p.events[p.events.length - 1]?.type || 'none'
    const x = (i % colCount) * (width / colCount) - strokeWidth * 0.5 * (i % colCount)
    const y = Math.floor(i / colCount) * (height / rowCount) - strokeWidth * 0.5 * Math.floor(i / colCount)
    return (
      <g className={`${styles[status]}`} transform={`translate(${x}, ${y})`} key={p.country.alpha3} data-status={status}>
        <rect x={0} y={0} width={width / colCount} height={boxHeight} strokeWidth={strokeWidth} className={styles.rect}></rect>
        <text className={styles.label} x={padding} y={boxHeight - padding * 1}>
          {p.country.alpha3}
        </text>
      </g>
    )
  })

  const uniqueStatuses = []

  function normaliseStatus(s) {
    if (s === 'accession' || s === 'acceptance' || s === 'succession') {
      return 'accession'
    }
    return s
  }

  treaty.participants.forEach((el) => {
    if (uniqueStatuses.indexOf(normaliseStatus(el.status)) === -1) {
      uniqueStatuses.push(normaliseStatus(el.status))
    }
  })

  const statusLabels = {
    ratification: 'Adopted by ratification',
    accession: 'Adopted by accession, acceptance, or succession',
    signature: 'Signed but not adopted',
    none: 'Not adopted',
  }

  const legendEls = uniqueStatuses.map((status) => {
    return (
      <li className={`${styles.legendItem} ${styles[status]}`} key={`label.${status}`}>
        <svg style={{ overflow: 'visible' }} viewBox="0 0 10 10" preserveAspectRatio="none">
          <rect x={0} y={0} height={10} width={10} />
        </svg>
        <span>{statusLabels[status]}</span>
      </li>
    )
  })

  return (
    <div>
      <svg height={height} style={{ overflow: 'visible' }}>
        <g>{countryEls}</g>
      </svg>
      <ul className={styles.legend}>{legendEls}</ul>
      {treaty.scrapeURL && (
        <p className="caption">
          Data: <a href={treaty.scrapeURL}>United Nations Treaty Collection</a>
        </p>
      )}
    </div>
  )
}

export default PrintTreatyParticipantGraph
