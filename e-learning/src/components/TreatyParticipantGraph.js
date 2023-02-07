import React from 'react'
import * as styles from './TreatyParticipantGraph.module.scss'

export default function TreatyParticipantGraph({ treaty }) {
  const countryEls = treaty.participants.map((p) => {
    const status = p.events[p.events.length - 1].type
    return (
      <li data-status={status} className={`${styles.item} ${styles[status]}`}>
        {p.cca2}
      </li>
    )
  })
  return <ul className={styles.container}>{countryEls}</ul>
}
