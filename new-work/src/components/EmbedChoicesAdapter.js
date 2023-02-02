import React, { useContext } from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import { EmbedChoicesContext } from '../context/EmbedChoicesContext'
import { EmbedChoices } from '@prif/shared'

export default function EmbedChoicesAdapter({ ...props }) {
  const data = useStaticQuery(graphql`
    query {
      providers: allEmbedProvidersJson(filter: { provider: { ne: "default" } }) {
        nodes {
          description
          provider
          title
        }
      }
    }
  `)
  const { choices, setChoices } = useContext(EmbedChoicesContext)

  const onChange = (e, provider) => {
    setChoices((prev) => {
      let newChoices = { ...prev }
      newChoices[provider] = !newChoices[provider]
      return newChoices
    })
  }
  return <EmbedChoices providers={data.providers} choices={choices} onChange={onChange} {...props} />
}
