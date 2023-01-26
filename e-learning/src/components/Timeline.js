import React, { useState } from 'react'
import { useId } from 'react'
import * as styles from './Timeline.module.scss'

function Timeline(props) {
  const baseId = useId()
  const events = React.Children.map(props.children, (child, i) => {
    return React.cloneElement(child, {
      key: `baseId-${i}`,
    })
  })
  return (
    <div className={styles.container}>
      <span className={styles.line}></span>
      <ol>{events}</ol>
    </div>
  )
}
function Event({ date, title, collapsed, children }) {
  const [isCollapsed, setIsCollapsed] = useState(collapsed)
  const handleToggle = () => {
    setIsCollapsed(!isCollapsed)
  }
  return (
    <li className={styles.event}>
      <div className={styles.eventDescription}>
        <div className={styles.eventHeader}>
          <div>
            <span className={styles.eventDate}>{date}</span>
            <h3 className={styles.eventTitle}>{title}</h3>
          </div>
          {/* {collapsed !== undefined && ( */}
          <button className={styles.eventToggle} onClick={handleToggle}>
            {isCollapsed ? 'Expand' : 'Collapse'}
          </button>
        </div>
        {!isCollapsed && <div>{children}</div>}
      </div>
    </li>
  )
}

export { Timeline, Event }
