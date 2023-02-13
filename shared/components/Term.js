import React, { useState, useRef } from 'react'
import CloseIcon from '../assets/close.svg'

export default function Term({ TooltipAdapter, styles, term, children, ...props }) {
  if (!styles) styles = {}
  const [active, setActive] = useState(false)
  const triggerRef = useRef()

  function toggleTooltip() {
    setActive(!active)
  }

  if (term) {
    return (
      <>
        <button type="button" ref={triggerRef} onClick={toggleTooltip} className={styles.container}>
          {props.children ? <>{children}</> : <>{term.term_id}</>}
        </button>
        <TooltipAdapter position="topCenter" active={active} targetEl={triggerRef.current}>
          <span className={styles.content}>
            <span className={styles.header}>
              <em className={styles.title}>{term.title}</em>
              <button onClick={toggleTooltip} role="button" className={styles.close}>
                Close
                <CloseIcon />
              </button>
            </span>
            <span className={styles.description}>{term.description}</span>
          </span>
        </TooltipAdapter>
      </>
    )
  } else {
    return <>{children}</>
  }
}
