import React from 'react'
import MarkdownRenderer from 'react-markdown-renderer'
import Toggle from './Toggle'

export default function Embed({ styles, url, caption, title, provider, width, height, embedChoices, setEmbedChoices }) {
  if (!styles) styles = {}
  const embedStyles = {
    paddingTop: `${(height / width) * 100}%`,
  }

  function handleLoadClick(e) {
    if (provider !== 'default') {
      setEmbedChoices((prev) => {
        let newChoices = { ...prev }
        newChoices[provider] = !newChoices[provider]
        return newChoices
      })
    }
  }

  const isActive = embedChoices[provider] || false

  return (
    <figure className={styles.container}>
      {!isActive && (
        <div className={styles.consent}>
          <MarkdownRenderer markdown={provider.description} />
          <div className={styles.controls}>
            <Toggle className={styles.button} checked={isActive} label={`${provider.title}-Inhalte anzeigen`} onChange={handleLoadClick} />
          </div>
        </div>
      )}
      {isActive && (
        <>
          <div className={styles.iframeContainer} style={embedStyles}>
            <iframe
              title={title}
              src={url}
              frameBorder="0"
              allowFullScreen
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
          <figcaption className={styles.caption}>
            <div>{caption}</div>
            <Toggle size="small" checked={isActive} label={`${provider.title}-Inhalte anzeigen`} onChange={handleLoadClick} />
          </figcaption>
        </>
      )}
    </figure>
  )
}
