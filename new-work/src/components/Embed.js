import { graphql, useStaticQuery } from 'gatsby'
import React, { useContext } from 'react'
import MarkdownRenderer from 'react-markdown-renderer'
import { EmbedChoicesContext } from '../context/EmbedChoicesContext'
import Toggle from './Toggle'
import * as styles from './Embed.module.scss'

function Embed({ url, caption, title, provider, width, height }) {
  const data = useStaticQuery(graphql`
    query {
      providers: allEmbedProvidersJson {
        nodes {
          description
          provider
          title
        }
      }
    }
  `)
  const { embedChoices, setEmbedChoices } = useContext(EmbedChoicesContext)
  if (!provider) provider = 'default'

  let providerData = null
  data.providers.nodes.forEach((p) => {
    if (p.provider === provider) {
      providerData = p
    }
  })

  const isActive = embedChoices[provider] || false

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

  return (
    <figure className={styles.container}>
      {!isActive && (
        <div className={styles.consent}>
          <MarkdownRenderer markdown={providerData.description} />
          <div className={styles.controls}>
            <Toggle className={styles.button} checked={isActive} label={`${providerData.title}-Inhalte anzeigen`} onChange={handleLoadClick} />
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
            <Toggle size="small" checked={isActive} label={`${providerData.title}-Inhalte anzeigen`} onChange={handleLoadClick} />
          </figcaption>
        </>
      )}
    </figure>
  )
}

function Vimeo({ url, width, height, caption }) {
  const matches = url.match(/(?:vimeo.com\/)(\d+)/)
  let src = null
  if (matches && matches[1]) {
    src = `https://player.vimeo.com/video/${matches[1]}?h=0e92d36ba9&title=0&byline=0&portrait=0`
  }
  return <Embed provider="vimeo" width={width} height={height} url={src} caption={caption} />
}

function Youtube({ url, title, caption, width, height }) {
  const matches = url.match(/(?:youtube.com\/watch\?v=)(.+)/)
  return (
    <Embed
      width={width}
      height={height}
      title={title}
      url={`https://www.youtube-nocookie.com/embed/${matches[1]}`}
      caption={caption}
      provider="youtube"
    />
  )
}

export { Vimeo, Youtube, Embed }
