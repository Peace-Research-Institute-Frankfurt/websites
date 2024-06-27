import React from 'react'
import * as styles from './EventBanner.module.scss'
import Button from './ButtonAdapter'
import ArrowRightIcon from '../images/arrow-right.svg'
import { StaticImage } from 'gatsby-plugin-image'

export default function EventBanner() {
  return (
    <section className={styles.container}>
      <div className={styles.illustrationContainer}>
        <StaticImage src={'../images/Rosa-Ahlers_Inner-Work-crop.png'} className={styles.illustration} />
      </div>
      <span className={styles.eyebrow}>Veranstaltung</span>
      <h2 className={styles.title}>
        <em>KI und New Work</em>
        <span>Zukunftsstrategien für Wissenschaftseinrichtungen</span>
      </h2>
      <p className={styles.intro}>
        Neue Entwicklungen wie künstliche Intelligenz und New Work haben großen Einfluss auf wissenschaftliche Einrichtungen. Wie kann es den
        Instituten gelingen, auf diese rasanten Veränderungen zu reagieren? Welche Chancen bieten innovative Technologien und moderne Arbeitskonzepte
        für die Gestaltung der Berufswelt von morgen?
      </p>
      <div className={styles.details}>
        <p>26. September 2024, 11:30–17:00</p>
        <p>Festsaal, Senckenberg Naturmuseum Frankfurt</p>
      </div>
      <div className={styles.cta}>
        <a href="https://www.example.com">
          Jetzt anmelden <ArrowRightIcon />
        </a>
      </div>
    </section>
  )
}
