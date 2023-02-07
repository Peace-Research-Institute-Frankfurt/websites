import React from 'react'
import { Tabs, Tab } from './TabsAdapter'
import * as styles from './LectureVideo.module.scss'

export default function LectureVideo({ lu, vl, provider, children }) {
  let src = ''
  if (provider === 'video-stream') {
    src = `https://start.video-stream-hosting.de/player_videojs.html?serverip=62.113.210.7&serverapp=hsfk2-vod&autostart=0&smil=${lu}/${vl}.smil&bgimage=https://nonproliferation-elearning.eu/learningunits/disarmament-machinery/vid/${lu}_${vl}.jpg&untertitelDatei=https://nonproliferation-elearning.eu/learningunits/disarmament-machinery/vid/${lu}_${vl}.vtt&untertitelLand=en&untertitelAnzeige=English&untertitelAutoaktiv=0&nocookie=1`
  } else {
    src = `https://nonproliferation-elearning.eu/learningunits/video.php?lu=${lu}&vl=${vl}&sub`
  }

  return (
    <div className={styles.container}>
      <Tabs>
        <Tab title="Video">
          <div className={styles.iframeContainer}>
            <iframe title={`lecture-${vl}`} src={src} loading="lazy" allowFullScreen></iframe>
          </div>
        </Tab>
        <Tab title="Transcript">{children}</Tab>
      </Tabs>
    </div>
  )
}
