import React, { useId } from 'react'
import { Toggle } from '@prif/shared'

export default function EmbedChoices({ styles, providers, choices, onChange }) {
  const baseId = useId()
  const items = providers.nodes.map((p, i) => {
    return (
      <li key={`${baseId}-${i}`}>
        <Toggle
          label={p.title}
          className={styles.choice}
          checked={choices[p.provider] || false}
          onChange={(e) => {
            onChange(e, p.provider)
          }}
        />
      </li>
    )
  })

  return <ul className={styles.container}>{items}</ul>
}
