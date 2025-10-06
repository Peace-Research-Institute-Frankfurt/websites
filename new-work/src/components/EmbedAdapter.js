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

export { EmbedAdapter, Youtube }
