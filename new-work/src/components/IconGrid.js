import React from 'react'
import AttraktivIcon from '../images/icon-attraktivitaet.svg'
import GesamtIcon from '../images/icon-gesamt.svg'
import GesundheitIcon from '../images/icon-gesundheit.svg'
import MotivationIcon from '../images/icon-motivation.svg'
import NachhaltigkeitIcon from '../images/icon-nachhaltigkeit.svg'
import OrtIcon from '../images/icon-ort.svg'
import PlanungIcon from '../images/icon-planung.svg'
import ProduktivitaetIcon from '../images/icon-produktivitaet.svg'
import RechtIcon from '../images/icon-recht.svg'
import SchutzIcon from '../images/icon-schutz.svg'
import StimmungIcon from '../images/icon-stimmung.svg'
import TeamIcon from '../images/icon-team.svg'
import VernetzungIcon from '../images/icon-vernetzung.svg'
import WissenschaftIcon from '../images/icon-wissenschaft.svg'
import ZeitIcon from '../images/icon-zeit.svg'

import * as styles from './IconGrid.module.scss'

const icons = {
  attraktiv: <AttraktivIcon />,
  gesamt: <GesamtIcon />,
  gesundheit: <GesundheitIcon />,
  motivation: <MotivationIcon />,
  nachhaltigkeit: <NachhaltigkeitIcon />,
  ort: <OrtIcon />,
  planung: <PlanungIcon />,
  produktivitaet: <ProduktivitaetIcon />,
  recht: <RechtIcon />,
  schutz: <SchutzIcon />,
  stimmung: <StimmungIcon />,
  team: <TeamIcon />,
  vernetzung: <VernetzungIcon />,
  wissenschaft: <WissenschaftIcon />,
  zeit: <ZeitIcon />,
}

export default function IconGrid({ themes }) {
  return (
    <ul className={styles.container}>
      {themes.map((el) => {
        return (
          <li className={styles.item}>
            <span className={styles.icon}>{icons[el.icon]}</span>
            <p className={styles.copy}>{el.copy}</p>
          </li>
        )
      })}
    </ul>
  )
}
