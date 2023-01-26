import React from 'react'
import * as styles from './Chip.module.scss'

export default function Chip({ text, color }) {
  const chipClass = styles['chip' + color[0].toUpperCase() + color.substr(1)]
  return <span className={chipClass}>{text}</span>
}
