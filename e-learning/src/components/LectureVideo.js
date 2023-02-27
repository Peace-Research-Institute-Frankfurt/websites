import React from 'react'
import { Tabs, Tab } from './TabsAdapter'
import * as styles from './LectureVideo.module.scss'

export default function LectureVideo({ lu, vl, subtitles, poster, smil, provider, children }) {
  let src = ''
  if (provider === 'video-stream') {
    src = `https://start.video-stream-hosting.de/player_videojs.html?serverip=62.113.210.7&serverapp=hsfk2-vod&autostart=0&smil=${smil}&bgimage=${poster}${
      subtitles && `&untertitelDatei=${subtitles}&untertitelLand=en&untertitelAnzeige=English&untertitelAutoaktiv=0`
    }&nocookie=1`
  } else {
    src = `https://nonproliferation-elearning.eu/learningunits/video.php?lu=${lu}&vl=${vl}&sub`
  }

  return (
    <div className={styles.container}>
      <Tabs>
        <Tab title="Video">
          <div className={styles.iframeContainer}>
            <iframe frameBorder="0" title={`lecture-${vl}`} src={src} loading="lazy" allowFullScreen></iframe>
          </div>
        </Tab>
        <Tab title="Transcript">{children}</Tab>
      </Tabs>
    </div>
  )
}
