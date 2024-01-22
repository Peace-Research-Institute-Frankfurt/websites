import React, { useContext } from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import SharedEmbed from '@shared/components/Embed'
import Button from './ButtonAdapter'
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
  return (
    <SharedEmbed
      provider={providerData}
      embedChoices={choices}
      setEmbedChoices={setChoices}
      buttonComponent={Button}
      {...props}
      consentButtonProps={{ size: 'small', label: `Inhalte laden` }}
      activeButtonProps={{ size: 'small', label: `Inhalte von ${providerData.title} deaktivieren` }}
    />
  )
}

function Vimeo({ styles, url, width, height, caption }) {
  const matches = url.match(/(?:vimeo.com\/)(\d+)(?:\/)(.+)/)
  let src = null
  console.log(matches)
  if (matches && matches[1]) {
    src = `https://player.vimeo.com/video/${matches[1]}?h=${matches[2]}&title=0&byline=0&portrait=0`
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
