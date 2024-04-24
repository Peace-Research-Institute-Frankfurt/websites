import React from 'react'
import { LegendOrdinal } from '@visx/legend'
import { scaleOrdinal } from '@visx/scale'
import * as styles from './LayeredMap.module.scss'

export default function MarkerLayerLegend({ markerGroupName }) {
  const ordinalColorScale = scaleOrdinal({
    domain: [markerGroupName],
    range: ['#0F1A24FF'],
  })

  return (
    <div>
      <LegendOrdinal scale={ordinalColorScale} labelFormat={(label) => `${label.toUpperCase()}`}>
        {(labels) => (
          <div>
            {labels.map((label, i) => (
              <li key={`legend-item-${i}`} className={styles.legendItem}>
                <svg width={10} height={10} viewBox="0 0 10 10" className={styles.legendItemIcon}>
                  <circle r={5} cx={5} cy={5} />
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
