import React from 'react'
import * as styles from './Table.module.scss'

export default function Table({ headers, rows }) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        {headers && (
          <thead>
            <tr>
              {headers.map((header, i) => (
                <th key={i}>{header}</th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td 
                  key={j}
                  align={cell.align || 'left'}
                  rowSpan={cell.rowspan}
                  colSpan={cell.colspan}
                >
                  {Array.isArray(cell.content) ? (
                    <ul>
                      {cell.content.map((item, k) => (
                        <li key={k}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    cell.content || cell
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
