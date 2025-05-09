import React, { useState, useRef } from 'react'
import CloseIcon from '../assets/close.svg'

export default function Term({ TooltipAdapter, styles, term, title, description, displayBy = "term_id", children, ...props }) {
  if (!styles) styles = {}
  const [active, setActive] = useState(false)
  const triggerRef = useRef()

  function toggleTooltip() {
    setActive(!active)
  }
  //<!-- {children ? <>{children}</> : <>{term.term_id}</>} -->
  if (term) {
    return (
      <>
        <button type="button" ref={triggerRef} onClick={toggleTooltip} className={`${styles.container} ${active ? styles.active : ''}`}>
          {children ? <>{children}</> : <>{displayBy === "title" ? title : term.term_id}</>}
        </button>
        <TooltipAdapter position="topCenter" active={active} targetEl={triggerRef.current}>
          <span className={styles.content}>
            <span className={styles.header}>
              {title && <em className={styles.title}>{title}</em>}
              <button onClick={toggleTooltip} role="button" className={styles.close}>
                Close
                <CloseIcon />
              </button>
            </span>
            {description && <span className={styles.description}>{description}</span>}
          </span>
        </TooltipAdapter>
      </>
    )
  } else {
    return <>{children}</>
  }
}
