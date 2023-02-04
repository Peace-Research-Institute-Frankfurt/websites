import React, { useState, useId } from 'react'
import * as styles from './LectureVideo.module.scss'

function Tab({ children, tabId, labelledBy, isActive }) {
  const activeClass = isActive ? styles.tabContentActive : ''
  return (
    <div className={`${styles.tabContent} ${activeClass}`} aria-labelledby={labelledBy} id={tabId}>
      {children}
    </div>
  )
}

export default function LectureVideo({ lu, vl, transcript, size, provider, children }) {
  let src = ''
  const baseId = useId()
  if (provider === 'video-stream') {
    src = `https://start.video-stream-hosting.de/player_videojs.html?serverip=62.113.210.7&serverapp=hsfk2-vod&autostart=0&smil=${lu}/${vl}.smil&bgimage=https://nonproliferation-elearning.eu/learningunits/disarmament-machinery/vid/${lu}_${vl}.jpg&untertitelDatei=https://nonproliferation-elearning.eu/learningunits/disarmament-machinery/vid/${lu}_${vl}.vtt&untertitelLand=en&untertitelAnzeige=English&untertitelAutoaktiv=0&nocookie=1`
  } else {
    src = `https://nonproliferation-elearning.eu/learningunits/video.php?lu=${lu}&vl=${vl}&sub`
  }

  const [currentTab, setCurrentTab] = useState(1)
  const tabs = ['video', 'text']
  function generateId(base, index) {
    return `${base}-${index}`
  }

  function handleTabClick(e, i) {
    e.preventDefault()
    setCurrentTab(i)
  }

  const videoEl = (
    <div className={styles.iframeContainer}>
      <iframe title={`lecture-${vl}`} src={src} loading="lazy" allowFullScreen frameBorder="0"></iframe>
    </div>
  )

  const textEl = <section>{children}</section>

  const tabItems = tabs.map((tab, i) => {
    const id = generateId(baseId, i)
    const isActive = currentTab === i
    const activeClass = isActive ? styles.tabActive : ''
    return (
      <li className={`${styles.tab} ${activeClass}`} key={`tab-${i}`}>
        <button onClick={(e) => handleTabClick(e, i)} aria-controls={id} role="tab">
          {tab}
        </button>
      </li>
    )
  })

  const tabContent = tabs.map((c, i) => {
    return (
      <Tab key={`tabs-${i}`} tabId={generateId(baseId, i)} isActive={currentTab === i}>
        {[videoEl, textEl][i]}
      </Tab>
    )
  })

  return (
    <div className={styles.container}>
      <ul className={styles.tabsList}>{tabItems}</ul>
      <div>{tabContent}</div>
    </div>
  )
}
