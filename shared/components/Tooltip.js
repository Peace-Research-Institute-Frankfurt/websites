import React, { useEffect, useRef, useState } from 'react'
import useScrollPosition from '../hooks/useScrollPosition'
import useViewport from '../hooks/useViewport'
import { clamp } from './utils'
import { createPortal } from 'react-dom'

export default function Tooltip({ styles, active, children, id, targetEl, renderTargetEl }) {
  if (!styles) styles = {}
  const scrollPosition = useScrollPosition()
  const viewportSize = useViewport()
  const containerRef = useRef()
  const [targetRect, setTargetRect] = useState({})

  useEffect(() => {
    if (targetEl) {
      setTargetRect(targetEl.getBoundingClientRect())
    }
  }, [targetEl, scrollPosition, viewportSize])

  let containerStyles = {}
  let arrowStyles = {}
  let arrowClass = null
  if (targetEl) {
    const tr = targetRect
    const cr = containerRef.current.getBoundingClientRect()
    const padding = 10
    let xClamped = 0

    if (tr.x - cr.width / 2 < padding) {
      xClamped = tr.x
    } else {
      xClamped = clamp(padding, tr.x + tr.width / 2 - cr.width / 2, window.innerWidth - cr.width - tr.width / 2 - padding)
    }

    let yClamped = 0
    if (tr.y - padding < cr.height + 55) {
      yClamped = tr.y + tr.height + cr.height + padding
      arrowClass = styles.arrowTop
    } else {
      yClamped = tr.y - padding
      arrowClass = styles.arrowBottom
    }

    containerStyles = { transform: `translateY(${yClamped}px) translateY(-100%) translateX(${xClamped}px)` }
    arrowStyles = { ...arrowStyles, left: `${tr.x - xClamped + tr.width / 2}px` }
  }

  if (!renderTargetEl) {
    return null
  }

  return createPortal(
    <span ref={containerRef} style={containerStyles} id={id} role="tooltip" className={`${styles.container} ${active ? styles.active : ''}`}>
      {children}
      <span style={arrowStyles} className={`${styles.arrow} ${arrowClass}`}></span>
    </span>,
    renderTargetEl
  )
}
