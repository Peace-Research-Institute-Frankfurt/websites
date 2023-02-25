import React, { useContext } from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import { EmbedChoicesContext } from '../context/EmbedChoicesContext'
import SharedEmbedChoices from '@shared/components/EmbedChoices'
import * as styles from './EmbedChoices.module.scss'

export default function EmbedChoices({ ...props }) {
  const data = useStaticQuery(graphql`
    query {
      providers: allEmbedProvidersJson(filter: { name: { ne: "default" } }) {
        nodes {
          name
          title
          shortDescription
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
  return <SharedEmbedChoices styles={styles} providers={data.providers.nodes} choices={choices} onChange={onChange} {...props} />
}
