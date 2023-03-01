import React from 'react'
import SharedButton from '@shared/components/Button'
import * as styles from './Button.module.scss'

export function ButtonGroup({ children }) {
  return <div className={styles.group}>{children}</div>
}

export default function Button(props) {
  return <SharedButton styles={styles} {...props} />
}
