import { graphql, useStaticQuery } from 'gatsby'
import React, { useContext, useId } from 'react'
import { EmbedChoicesContext } from '../context/EmbedChoicesContext'
import Toggle from './Toggle'
import * as styles from './EmbedChoices.module.scss'

export default function EmbedChoices() {
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
  const baseId = useId()
  const { embedChoices, setEmbedChoices } = useContext(EmbedChoicesContext)

  const handleChange = (e, provider) => {
    setEmbedChoices((prev) => {
      let newChoices = { ...prev }
      newChoices[provider] = !newChoices[provider]
      return newChoices
    })
  }

  const providers = data.providers.nodes.map((p, i) => {
    return (
      <li key={`${baseId}-${i}`}>
        <Toggle
          label={p.title}
          className={styles.choice}
          checked={embedChoices[p.provider] || false}
          onChange={(e) => {
            handleChange(e, p.provider)
          }}
        />
      </li>
    )
  })

  return <ul className={styles.container}>{providers}</ul>
}
