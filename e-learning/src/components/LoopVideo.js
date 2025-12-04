import React from 'react';
import * as styles from './LoopVideo.module.scss';

export default function LoopVideo({ src }) {
  return (
    <div className={styles.wrapper}>
      <video
        className={styles.video}
        autoPlay
        loop
        muted
        playsInline
        controls
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
