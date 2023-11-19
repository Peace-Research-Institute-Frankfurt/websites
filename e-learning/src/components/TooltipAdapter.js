import React, { useEffect, useState } from 'react'
import Tooltip from '@shared/components/Tooltip'
import * as styles from './Tooltip.module.scss'

export default function TooltipAdapter({ ...props }) {
  const [renderTargetEl, setRenderTargetEl] = useState(null)

  useEffect(() => {
    setRenderTargetEl(document.querySelector('#tooltips'))
  }, [setRenderTargetEl])

  return <Tooltip styles={styles} renderTargetEl={renderTargetEl} {...props} />
}
