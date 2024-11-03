import React from 'react'
import PlaceIcon from '../images/nw-place.svg'
import TimeIcon from '../images/nw-time.svg'
import { Link } from 'gatsby'
import * as styles from './IconTile.module.scss'

export default function IconTile({ eyebrow, body, to, icon }) {
  return (
    <Link to={to} className={styles.wrapper}>
      <section className={styles.copy}>
        <span className={styles.eyebrow}>{eyebrow}</span>
        <p className={styles.body}>{body}</p>
      </section>
      <section className={styles.icon}>
        {icon === 'place' && <PlaceIcon />}
        {icon === 'time' && <TimeIcon />}
      </section>
    </Link>
  )
}
