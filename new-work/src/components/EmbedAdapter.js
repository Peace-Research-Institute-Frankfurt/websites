import React, { useContext } from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import Embed from '@shared/components/Embed'
import { EmbedChoicesContext } from '../context/EmbedChoicesContext'

function EmbedAdapter({ provider, ...props }) {
  const data = useStaticQuery(graphql`
    query {
      providers: allEmbedProvidersJson {
        nodes {
          name
          title
          description
        }
      }
    }
  `)
  if (!provider) provider = 'default'

  let providerData = null
  data.providers.nodes.forEach((p) => {
    if (p.name === provider) {
      providerData = p
    }
  })
  const { choices, setChoices } = useContext(EmbedChoicesContext)

  return <Embed provider={providerData} embedChoices={choices} setEmbedChoices={setChoices} {...props} />
}

function Vimeo({ styles, url, width, height, caption }) {
  const matches = url.match(/(?:vimeo.com\/)(\d+)/)
  let src = null
  if (matches && matches[1]) {
    src = `https://player.vimeo.com/video/${matches[1]}?h=0e92d36ba9&title=0&byline=0&portrait=0`
  }
  return <EmbedAdapter styles={styles} provider="vimeo" width={width} height={height} src={src} caption={caption} />
}

function Youtube({ styles, url, title, caption, width, height }) {
  const matches = url.match(/(?:youtube.com\/watch\?v=)(.+)/)
  return (
    <EmbedAdapter
      styles={styles}
      width={width}
      height={height}
      title={title}
      src={`https://www.youtube-nocookie.com/embed/${matches[1]}`}
      caption={caption}
      provider="youtube"
    />
  )
}

export { EmbedAdapter, Vimeo, Youtube }
