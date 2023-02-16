import React from 'react'
import Tooltip from '@shared/components/Tooltip'
import * as styles from './Tooltip.module.scss'

export default function TooltipAdapter({ ...props }) {
  return <Tooltip styles={styles} {...props} />
}
