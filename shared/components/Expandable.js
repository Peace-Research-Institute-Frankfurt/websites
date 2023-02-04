import React, { useState } from 'react'
import ArrowDownIcon from '../assets/arrow-down.svg'
import ArrowUpIcon from '../assets/arrow-up.svg'
import Button from './Button'
import * as styles from './Expandable.module.scss'

export default function Expandable({ style, expanded, buttonStyles, children }) {
  const [isExpanded, setExpanded] = useState(expanded || false)

  return (
    <div style={style} className={`${styles.container} ${isExpanded ? styles.expanded : null}`}>
      <div className={styles.content}>{children}</div>
      <div className={styles.toggle}>
        <Button
          styles={buttonStyles}
          icon={isExpanded ? <ArrowUpIcon /> : <ArrowDownIcon />}
          label={isExpanded ? 'Collapse' : 'Expand'}
          onClick={() => {
            setExpanded(!isExpanded)
          }}
        />
      </div>
    </div>
  )
}
