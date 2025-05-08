import React from 'react'
import { Tabs, Tab } from './TabsAdapter'
import * as styles from './LectureVideo.module.scss'

export default function LectureVideo({ lu, vl, subtitles, poster, autostart, smil, provider, children }) {
  let src = '';

  if (provider === 'video-stream') {
    const params = new URLSearchParams({
      serverip: '62.113.210.7',
      serverapp: 'hsfk2-vod',
      smil: smil || '',
      nocookie: '1',
    });

    // Optional hinzufügen, wenn definiert
    if (autostart) params.append('autostart', '1');
    if (poster) params.append('bgimage', poster);
    if (subtitles) params.append('subtitles', subtitles);

    src = `https://start.video-stream-hosting.de/player_videojs.html?${params.toString()}`;
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
