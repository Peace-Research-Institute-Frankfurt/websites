import React, { forwardRef } from 'react'
import SharedButton from '@shared/components/Button'
import * as styles from './Button.module.scss'

const Button = forwardRef(function Button(props, ref) {
  return <SharedButton styles={styles} {...props} ref={ref} />
})

export default Button
