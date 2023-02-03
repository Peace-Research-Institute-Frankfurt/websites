import React, { useId } from 'react'
import MarkdownRenderer from 'react-markdown-renderer'

export default function EmbedChoices({ styles, providers, choices, onChange }) {
  const baseId = useId()
  const items = providers.map((p, i) => {
    const isChecked = choices[p.name] || false
    return (
      <li key={`${baseId}-${i}`} className={`${styles.choice} ${isChecked ? styles.checked : null}`}>
        <input
          className={styles.checkbox}
          type="checkbox"
          checked={isChecked}
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
