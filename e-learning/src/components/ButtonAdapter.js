import React from 'react'
import SharedButton from '../../../shared/components/Button'
import * as styles from './Button.module.scss'

export default function Button(props) {
  return <SharedButton styles={styles} {...props} />
}
