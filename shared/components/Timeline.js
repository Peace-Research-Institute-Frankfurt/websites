import React, { useState, useId } from 'react'

function Timeline({ styles, children }) {
  if (!styles) styles = {}
  const baseId = useId()
  const events = React.Children.map(children, (child, i) => {
    return React.cloneElement(child, {
      key: `${baseId}-${i}`,
    })
  })
  return (
    <div className={styles.container}>
      <span className={styles.line}></span>
      <ol>{events}</ol>
    </div>
  )
}
function Event({ styles, date, title, collapsed, children }) {
  if (!styles) styles = {}
  const [isCollapsed, setIsCollapsed] = useState(collapsed)
  const handleToggle = () => {
    setIsCollapsed(!isCollapsed)
  }
  return (
    <li className={styles.event}>
      <div className={styles.eventDescription}>
        <div className={styles.eventHeader}>
          <div className={styles.eventHeaderCopy}>
            <span className={styles.eventDate}>{date}</span>
            <h3 className={styles.eventTitle}>{title}</h3>
          </div>
          <button className={styles.eventToggle} onClick={handleToggle}>
            {isCollapsed ? 'Expand' : 'Collapse'}
          </button>
        </div>
        {!isCollapsed && <div className={styles.eventContent}>{children}</div>}
      </div>
    </li>
  )
}

export { Timeline, Event }
