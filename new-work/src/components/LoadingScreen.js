import React, { useState, useEffect } from 'react'
import * as styles from './LoadingScreen.module.scss'
import Logo from '../images/leibniz-logo.svg'
import useLocalStorage from '@shared/hooks/useLocalStorage'

export default function LoadingScreen() {
  const [seenOn, setSeenOn] = useLocalStorage('nw_seenLoadingScreenOn', false)
  const shouldShow = seenOn ? (new Date() - new Date(seenOn)) / 24 / 60 / 60 / 1000 > 7 : true
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (shouldShow) {
      setSeenOn(new Date())
      setActive(true)
      window.setTimeout(() => {
        setActive(false)
      }, 2000)
    }
  }, [setActive, setSeenOn, shouldShow])

  return (
    <div className={`${styles.container} ${active ? styles.containerActive : ''}`}>
      <Logo />
    </div>
  )
}
