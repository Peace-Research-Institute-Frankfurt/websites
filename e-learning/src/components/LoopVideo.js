import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import * as styles from './LoopVideo.module.scss'

export default function LoopVideo({
  src,
  caption,
  credit,
  license,
}) {
  return (
    <>
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

      {(caption || credit) && (
        <figcaption className={styles.captions}>
          {caption && (
            <span className={styles.caption}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ node, ...props }) => <span {...props} />,
                  a: ({ node, children, ...props }) => (
                    <a {...props} target="_blank" rel="noopener noreferrer">
                      {children}
                    </a>
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
                  a: ({ node, children, ...props }) => (
                    <a {...props} target="_blank" rel="noopener noreferrer">
                      {children}
                    </a>
                  ),
                }}
              >
                {`Source: ${credit}${
                  license ? `, [${license.title}](${license.url})` : ''
                }.`}
              </ReactMarkdown>
            </span>
          )}
        </figcaption>
      )}
    </>
  )
}
