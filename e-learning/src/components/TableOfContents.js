import React from 'react'
import * as styles from './TableOfContents.module.scss'

export default function TableOfContents({ items }) {
  if (items && items.length > 1) {
    const listItems = items.map((item, i) => {
      return (
        <li key={`toc-${i}`} className={styles.item}>
          <a href={item.url}>{item.title}</a>
          {item.items && <TableOfContents items={item.items} />}
        </li>
      )
    })
    return <ol className={styles.list}>{listItems}</ol>
  }
}
