import React, { useContext } from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import SharedEmbed from '@shared/components/Embed'
import { EmbedChoicesContext } from '../context/EmbedChoicesContext'
import Button from './ButtonAdapter'
import * as styles from './Embed.module.scss'

function Embed({ provider, ...props }) {
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
  const { choices, setChoices } = useContext(EmbedChoicesContext)

  let providerData = null
  data.providers.nodes.forEach((p) => {
    if (p.name === provider) {
      providerData = p
    }
  })

  return (
    <>
      <SharedEmbed provider={providerData} embedChoices={choices} setEmbedChoices={setChoices} styles={styles} buttonComponent={Button} {...props} />
    </>
  )
}
export { Embed }
