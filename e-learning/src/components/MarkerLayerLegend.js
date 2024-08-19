import React from 'react'
import { LegendOrdinal } from '@visx/legend'
import * as styles from './LayeredMap.module.scss'

export default function MarkerLayerLegend({ label, scale }) {
  return (
    <div>
      <p className={styles.legendTitle}>{label}</p>
      <LegendOrdinal scale={scale}>
        {(labels) => (
          <div>
            {labels.map((label, i) => (
              <li key={`legend-item-${i}`} className={styles.legendItem}>
                <svg width={10} height={10} viewBox="0 0 10 10" className={styles.legendItemIcon}>
                  <circle fill={label.value} r={4} cx={5} cy={5} />
                </svg>
                {label.datum}
              </li>
            ))}
          </div>
        )}
      </LegendOrdinal>
    </div>
  )
}
