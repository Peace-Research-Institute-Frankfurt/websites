import React from 'react'
import ReactMarkdown from 'react-markdown'
import * as styles from './Table.module.scss'

/**
 * Flexible Table-Komponente
 * - headers: Array von Spaltenüberschriften
 * - rows: Array von Arrays (Zellen)
 * - bulleted: true = Listen mit Punkten, false = Inline/Komma-getrennt
 */
export default function Table({ headers, rows, bulleted = true }) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        {/* Tabellenkopf */}
        {headers && (
          <thead>
            <tr>
              {headers.map((header, i) => (
                <th key={i}>{header}</th>
              ))}
            </tr>
          </thead>
        )}

        {/* Tabelleninhalt */}
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => {
                // Zelleninhalt normalisieren
                const cellData = typeof cell === 'object' && !Array.isArray(cell)
                  ? cell
                  : { content: cell }

                return (
                  <td
                    key={j}
                    align={cellData.align || 'left'}
                    rowSpan={cellData.rowspan}
                    colSpan={cellData.colspan}
                  >
                    {/* Wenn mehrere Inhalte (Array) */}
                    {Array.isArray(cellData.content) ? (
                      bulleted ? (
                        // Mit Stichpunkten
                        <ul>
                          {cellData.content.map((item, k) => (
                            <li key={k}>
                              {typeof item === 'string'
                                ? <ReactMarkdown>{item}</ReactMarkdown>
                                : item}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        // Ohne Stichpunkte → inline oder mit Kommas
                        <>
                          {cellData.content.map((item, k) => (
                            <React.Fragment key={k}>
                              {typeof item === 'string'
                                ? <ReactMarkdown>{item}</ReactMarkdown>
                                : item}
                              {k < cellData.content.length - 1 && ', '}
                            </React.Fragment>
                          ))}
                        </>
                      )
                    ) : (
                      // Einzelinhalt (kein Array)
                      typeof cellData.content === 'string'
                        ? <ReactMarkdown>{cellData.content}</ReactMarkdown>
                        : cellData.content
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
