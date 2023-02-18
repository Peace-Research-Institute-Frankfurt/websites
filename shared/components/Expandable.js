import React, { useState } from 'react'
import ArrowDownIcon from '../assets/arrow-down.svg'
import ArrowUpIcon from '../assets/arrow-up.svg'
import * as styles from './Expandable.module.scss'

export default function Expandable({ style, expanded, buttonComponent, children }) {
  const [isExpanded, setExpanded] = useState(expanded || false)
  const Button = buttonComponent || <>BUTTON</>
  return (
    <div style={style} className={`${styles.container} ${isExpanded ? styles.expanded : null}`}>
      <div className={styles.content}>{children}</div>
      <div className={styles.toggle}>
        <Button
          size="small"
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
