import React from 'react'
import * as styles from './EventBanner.module.scss'
import ArrowRightIcon from '../images/arrow-right.svg'
import StarIcon from '../images/star.svg'
import { StaticImage } from 'gatsby-plugin-image'
import Schedule from './Schedule'

export default function EventBanner() {
  return (
    <section className={styles.container}>
      <div className={styles.illustrationContainer}>
        <StaticImage
          src={'../images/Rosa-Ahlers_Inner-Work-crop.png'}
          className={styles.illustration}
          alt="Illustration mit zwei Personen; eine meditierend mit geschlossenen Augen und erhobenen Händen, die zweite geht durch eine Tür in der Brust der ersten."
        />
      </div>
      <span className={styles.eyebrow}>
        <StarIcon />
        Tagung
      </span>
      <h2 className={styles.title}>
        <em>KI und New Work</em>
        <span>Zukunftsstrategien für Wissenschaftseinrichtungen</span>
      </h2>
      <p className={styles.intro}>
        Am 26. September findet unser dritter WorkNew Day zum Thema KI und New Work statt. Kommen Sie nach Frankfurt und diskutieren Sie mit uns, wie
        Künstliche Intelligenz und neue Arbeitsformen Forschung und Verwaltung verändern werden. Wir freuen uns auf Sie, auf inspirierende Vorträge
        und den feierlichen Abschluss des Projekts WorkNew@leibniz!
      </p>
      <div className={styles.details}>
        <p>26. September 2024, 11:45–17:30</p>
        <p>Senckenberg Forschungsinstitut und Naturmuseum Frankfurt, Festsaal Jügelhaus </p>
        <p>Anmeldung bis 17. September 2024 · Die Veranstaltung ist kostenfrei.</p>
      </div>
      <Schedule to="2024-09-17">
        <div className={styles.cta}>
          <a href="https://eveeno.com/100759422">
            Anmeldung und Agenda <ArrowRightIcon />
          </a>
        </div>
      </Schedule>
    </section>
  )
}
