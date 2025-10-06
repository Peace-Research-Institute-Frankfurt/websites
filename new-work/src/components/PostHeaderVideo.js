import React, { useRef, useState } from 'react'
import Button from './ButtonAdapter'
import CrossIcon from '../images/cross.svg'
import * as styles from './PostHeaderVideo.module.scss'

export default function PostHeaderVideo({ src, poster }) {
  const [isActive, setIsActive] = useState(false)
  const closeButtonRef = useRef(null)
  const openButtonRef = useRef(null)

  const videoUrl = `/videos/${src}`
  const posterUrl = poster ? `/videos/${poster}` : null

  return (
    <div className={`${isActive ? styles.mediaActive : ''}`}>
      <div className={`${styles.poster}`}>
        {posterUrl && <img src={posterUrl} alt="" />}
      </div>
      <div className={styles.controls}>
        <Button
          label={`Film starten`}
          size="large"
          ref={openButtonRef}
          onClick={() => {
            setIsActive(true)
            closeButtonRef.current.focus()
          }}
        />
      </div>

      <div className={`${styles.media}`}>
        <div className={styles.mediaInner}>
          <div className={styles.mediaControls}>
            <Button
              label="Schließen"
              ref={closeButtonRef}
              icon={<CrossIcon />}
              hideLabel={true}
              onClick={() => {
                setIsActive(false)
                openButtonRef.current.focus()
              }}
            />
          </div>
          <video
            controls
            controlsList="nodownload"
            className={styles.video}
            autoPlay
          >
            <source src={videoUrl} type="video/mp4" />
            Ihr Browser unterstützt das Video-Tag nicht.
          </video>
        </div>
      </div>
    </div>
  )
}