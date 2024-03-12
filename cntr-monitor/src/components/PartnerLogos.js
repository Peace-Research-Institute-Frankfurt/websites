import React from 'react'
import TUDLogo from '../images/tud-logo.svg'
import PRIFLogo from '../images/prif-logo.svg'
import AALogo from '../images/aa-logo.svg'
import JLULogo from '../images/jlu-logo.svg'

import * as styles from './PartnerLogos.module.scss'

const PartnerLogos = () => {
  const logos = [<AALogo />, <PRIFLogo />, <TUDLogo />, <JLULogo />]
  return (
    <div className={styles.container}>
      <ul className={styles.list}>
        {logos.map((l) => (
          <li className={styles.item}>{l}</li>
        ))}
      </ul>
    </div>
  )
}

export default PartnerLogos
