import React, { useState, useEffect } from 'react'
import Tooltip from '@shared/components/Tooltip'
import * as styles from './Tooltip.module.scss'

export default function TooltipAdapter({ ...props }) {
  const [renderTargetEl, setRenderTargetEl] = useState(null)

  useEffect(() => {
    setRenderTargetEl(document.querySelector('#tooltips'))
  }, [setRenderTargetEl])

  return <Tooltip renderTargetEl={renderTargetEl} styles={styles} {...props} />
}
