import React from 'react'
import { graphql, useStaticQuery, Link } from 'gatsby'
import FundingLogo from '../assets/icons/funded-by-eu.svg'
import * as styles from './SiteFooter.module.scss'

export default function SiteFooter() {
  const data = useStaticQuery(graphql`
    query {
      meta: site {
        buildTime(formatString: "D MMMM Y, HH:mm")
      }
    }
  `)
  return (
    <footer className={styles.container}>
      <div className={styles.inner}>
        <nav className={styles.nav}>
          <ul>
            <li>
              <a href="https://www.nonproliferation.eu/">EUNPDC</a>
            </li>
            <li>
              <a href="https://www.hsfk.de/en/">PRIF</a>
            </li>
            <li>
              <a href="https://nonproliferation-elearning.eu/termsofuse">Terms</a>
            </li>
            <li>
              <a href="https://nonproliferation-elearning.eu/privacy/?id=56">Privacy</a>
            </li>
            <li>
              <a href="https://nonproliferation-elearning.eu/imprint">Contact</a>
            </li>
            <li>
              <Link to="/embedded-content-choices">Embedded content choices</Link>
            </li>
          </ul>
        </nav>
        <p>
          The EU Non-Proliferation and Disarmament eLearning Course aims to cover all aspects of the EU non-proliferation and disarmament agenda. It's
          produced by PRIF with financial assistance of the European Union. The contents of individual learning units are the sole responsibility of
          the respective authors and don't necessariy reflect the position of the European Union.
        </p>
        <FundingLogo className={styles.funding} />

        <p className={styles.meta}>Built {data.meta.buildTime}</p>
      </div>
    </footer>
  )
}
