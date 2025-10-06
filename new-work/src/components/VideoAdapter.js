import React, { useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import * as styles from './Video.module.scss'

export default function VideoAdapter({ caption, credit, size, alt, src, poster, qualities }) {
  const videoRef = useRef(null)
  
  // Wenn qualities nicht übergeben wird, nimm nur die src
  const videoVariants = qualities 
    ? qualities.map(q => ({
        quality: q,
        url: `/videos/${src.replace(/\s*\(\d+p\)/, '').replace(/\.\w+$/, '')} (${q}p).mp4`,
        label: `${q}p`
      }))
    : [{ quality: 1080, url: `/videos/${src}`, label: 'Standard' }]

  // Nach Qualität sortieren (höchste zuerst)
  videoVariants.sort((a, b) => b.quality - a.quality)

  const handleQualityChange = (e) => {
    const currentTime = videoRef.current.currentTime
    const isPaused = videoRef.current.paused
    videoRef.current.src = e.target.value
    videoRef.current.currentTime = currentTime
    if (!isPaused) {
      videoRef.current.play()
    }
  }

  const posterUrl = poster ? `/videos/${poster}` : null

  return (
    <figure className={`${styles.container} ${styles[size]}`}>
      <div className={styles.inner}>
        <div className={styles.videoContainer}>
          <div className={styles.videoWrapper}>
            <video
              ref={videoRef}
              className={styles.video}
              controls
              controlsList="nodownload"
              poster={posterUrl}
              aria-label={alt}
            >
              {videoVariants.map((variant) => (
                <source
                  key={variant.quality}
                  src={variant.url}
                  type="video/mp4"
                />
              ))}
              Ihr Browser unterstützt das Video-Tag nicht.
            </video>
            {videoVariants.length > 1 && (
              <div className={styles.qualityOverlay}>
                <select
                  onChange={handleQualityChange}
                  defaultValue={videoVariants[0].url}
                  aria-label="Videoqualität wählen"
                >
                  {videoVariants.map((variant) => (
                    <option key={variant.quality} value={variant.url}>
                      {variant.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
        {(credit || caption) && (
          <figcaption className={styles.captions}>
            {caption && (
              <span className={styles.caption}>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ node, ...props }) => <span {...props} />,
                    a: ({ node, ...props }) => (
                      <a {...props} target="_blank" rel="noopener noreferrer" />
                    ),
                  }}
                >
                  {caption}
                </ReactMarkdown>
              </span>
            )}
            {credit && (
              <span className={styles.credit}>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ node, ...props }) => <span {...props} />,
                    a: ({ node, ...props }) => (
                      <a {...props} target="_blank" rel="noopener noreferrer" />
                    ),
                  }}
                >
                  {`Source: ${credit}.`}
                </ReactMarkdown>
              </span>
            )}
          </figcaption>
        )}
      </div>
    </figure>
  )
}