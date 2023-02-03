import React, { useId } from 'react'
import MarkdownRenderer from 'react-markdown-renderer'

export default function EmbedChoices({ styles, providers, choices, onChange }) {
  const baseId = useId()
  const items = providers.map((p, i) => {
    return (
      <li key={`${baseId}-${i}`} className={styles.choice}>
        <input
          className={styles.checkbox}
          type="checkbox"
          checked={choices[p.name] || false}
          onChange={(e) => {
            onChange(e, p.name)
          }}
        />
        <div className={styles.description}>
          <h3>{p.title}</h3>
          <MarkdownRenderer markdown={p.shortDescription} />
        </div>
      </li>
    )
  })

  return <ul className={styles.container}>{items}</ul>
}
