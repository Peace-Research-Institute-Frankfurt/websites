import React from 'react'
import Icon from '../images/icon-test.svg'
import * as styles from './IconTile.module.scss'

export default function IconTile({ title }) {
  return (
    <div className={styles.wrapper}>
      <section className={styles.container}>
        <Icon />
        <h3 className={styles.title}>Title</h3>
        <p className={styles.copy}>
          Wie kann die Beantragung erfolgen und welche Regelungen gilt es zu beachten? Das ist sozial- und krankenversicherungsrechtlich sowie
          lohnsteuerrechtlich die mit Abstand schwierigste Fragestellung.
        </p>
      </section>
    </div>
  )
}
