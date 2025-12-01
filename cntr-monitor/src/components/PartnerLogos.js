import React from 'react'
import TUDLogo from '../images/tud-logo.svg'
import PRIFLogo from '../images/prif-logo.svg'
import AALogo from '../images/aa-logo.svg'
import JLULogo from '../images/jlu-logo.svg'

import * as styles from './PartnerLogos.module.scss'

const PartnerLogos = () => {
  const logos = [
    { component: <AALogo />, url: 'https://www.auswaertiges-amt.de/' },
    { component: <PRIFLogo />, url: 'https://www.prif.org/' },
    { component: <TUDLogo />, url: 'https://www.tu-darmstadt.de/' },
    { component: <JLULogo />, url: 'https://www.uni-giessen.de/de' },
  ]

  return (
    <div className={styles.container}>
      <ul className={styles.list}>
        {logos.map((logoObj, i) => (
          <li key={`partner.${i}`} className={styles.item}>
            <a href={logoObj.url} target="_blank" rel="noopener noreferrer">
              {logoObj.component}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PartnerLogos
