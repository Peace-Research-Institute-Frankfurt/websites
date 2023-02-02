import React, { useId } from 'react'
import { Toggle } from '@prif/shared'

export default function EmbedChoices({ styles, providers, choices, onChange }) {
  const baseId = useId()
  const items = providers.map((p, i) => {
    return (
      <li key={`${baseId}-${i}`} className={styles.choice}>
        <Toggle
          checked={choices[p.name] || false}
          onChange={(e) => {
            onChange(e, p.name)
          }}
        />
        <div className={styles.description}>
          <h3>{p.title}</h3>
          <p>{p.description}</p>
        </div>
      </li>
    )
  })

  return <ul className={styles.container}>{items}</ul>
}
