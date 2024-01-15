import React from 'react'
import * as styles from './Manifesto.module.scss'

const ManifestoSignatories = ({ children }) => {
  return <ul className={styles.signatories}>{children}</ul>
}

const ManifestoSignatory = ({ children }) => {
  return <li className={styles.signatory}>{children}</li>
}

const ManifestoList = ({ children }) => {
  return <ul className={styles.list}>{children}</ul>
}

const ManifestoListItem = ({ children }) => {
  return <li className={styles.listItem}>{children}</li>
}

export { ManifestoSignatories, ManifestoSignatory, ManifestoList, ManifestoListItem }
