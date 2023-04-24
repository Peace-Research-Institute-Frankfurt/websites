import React from 'react'
import MarkdownRenderer from 'react-markdown-renderer'

export default function Embed({
  styles,
  src,
  caption,
  title,
  provider,
  width,
  height,
  size,
  embedChoices,
  setEmbedChoices,
  buttonComponent,
  consentButtonProps,
  activeButtonProps,
}) {
  if (!styles) styles = {}
  if (!size) size = 'medium'
  const Button = buttonComponent || <>BUTTON</>

  let embedStyles = {}
  embedStyles = {
    paddingTop: `${(height / width) * 100}%`,
  }

  function handleLoadClick() {
    if (provider.name && provider.name !== 'default') {
      setEmbedChoices((prev) => {
        let newChoices = { ...prev }
        newChoices[provider.name] = !newChoices[provider.name]
        return newChoices
      })
    }
  }

  if (provider.description) {
    provider.description = provider.description.replace(/{src}/g, `[${src}](${src})`)
  }

  const isLocal = src.substring(0, 1) === '/'
  let isActive = embedChoices[provider.name] || isLocal || false

  return (
    <figure className={`${styles.container} ${styles[size]}`}>
      {!isActive && (
        <div className={styles.consent}>
          <MarkdownRenderer markdown={provider.description} />
          <div className={styles.consentControls}>
            <Button onClick={handleLoadClick} {...consentButtonProps} />
          </div>
        </div>
      )}
      {isActive && (
        <>
          <div className={styles.iframeContainer} style={embedStyles}>
            <iframe
              title={title}
              src={src}
              frameBorder="0"
              allowFullScreen
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
          <figcaption className={styles.captions}>
            <div className={styles.caption}>
              <MarkdownRenderer markdown={caption} />
            </div>
            <div className={styles.activeControls}>
              {!isLocal && provider.name !== 'default' && (
                <Button
                  size="small"
                  priority="text"
                  label={`Disable content from ${provider.title}`}
                  onClick={handleLoadClick}
                  {...activeButtonProps}
                />
              )}
            </div>
          </figcaption>
        </>
      )}
    </figure>
  )
}
