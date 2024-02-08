import React, { useState } from 'react'
import * as styles from './LoadingScreen.module.scss'
import Logo from '../images/leibniz-logo.svg'
import useLocalStorage from '@shared/hooks/useLocalStorage'

export default function LoadingScreen() {
  const [seenOn, setSeenOn] = useLocalStorage('nw_seenLoadingScreenOn', false)
  const daysSinceSeen = seenOn ? (new Date() - new Date(seenOn)) / 24 / 60 / 60 / 1000 : false

  const [active, setActive] = useState(seenOn === false || daysSinceSeen > 7)

  if (active) {
    window.setTimeout(() => {
      setActive(false)
      setSeenOn(new Date())
    }, 1500)
  }
  return (
    <div className={`${styles.container} ${active ? styles.containerActive : ''}`}>
      <Logo />
    </div>
  )
}
