import React, { useState } from 'react';
import { Tabs, Tab } from './TabsAdapter';
import * as styles from './LectureVideo.module.scss';

export default function LectureVideo({ lu, vl, subtitles, poster, autostart, smil, provider, children }) {
  const [videoStarted, setVideoStarted] = useState(false);
  
  const buildSrc = (autostartParam = false) => {
    if (provider === 'video-stream') {
      const params = new URLSearchParams({
        serverip: '62.113.210.7',
        serverapp: 'hsfk2-vod',
        smil: smil || '',
        nocookie: '1',
      });

      if (autostart || autostartParam) params.append('autostart', '1');
      if (subtitles) params.append('subtitles', subtitles);

      return `https://start.video-stream-hosting.de/player_videojs.html?${params.toString()}`;
    } else {
      return `https://nonproliferation-elearning.eu/learningunits/video.php?lu=${lu}&vl=${vl}&sub=1`;
    }
  };

  const src = buildSrc(videoStarted);

  return (
    <div className={styles.container}>
      <Tabs>
        <Tab title="Video">
          <div className={styles.iframeContainer}>
            {poster && !videoStarted && (
              <button
                className={styles.posterOverlay}
                onClick={() => setVideoStarted(true)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setVideoStarted(true);
                  }
                }}
                aria-label="Video abspielen"
                type="button"
              >
                <img src={poster} alt="Video Thumbnail" />
                <div className={styles.playButton} aria-hidden="true">
                  <svg width="40" height="40" viewBox="0 0 100 100">
                    <polygon points="30,20 80,50 30,80" fill="white" />
                  </svg>
                </div>
              </button>
            )}

            <iframe 
              title={`lecture-${vl}`} 
              src={src} 
              loading="lazy" 
              allowFullScreen
              allow="autoplay"
              style={{ 
                border: 'none',
                display: videoStarted || !poster ? 'block' : 'none' 
              }}
            />
          </div>
        </Tab>
        <Tab title="Transcript">{children}</Tab>
      </Tabs>
    </div>
  );
}