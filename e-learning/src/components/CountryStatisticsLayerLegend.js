import * as styles from './LayeredMap.module.scss'
import React from 'react'
import { LegendItem, LegendLabel, LegendThreshold } from '@visx/legend'
import { scaleThreshold } from '@visx/scale'

export default function CountryStatisticsLayerLegend({ legendRange, legendColorRange, statisticsGroupName }) {
  const thresholdScale = scaleThreshold({
    domain: legendRange,
    range: legendColorRange,
  })

  return (
    <div>
      <div className={styles.legendTitle}>{statisticsGroupName}</div>

      <div className={styles.legendInner}>
        {thresholdScale && (
          <LegendThreshold scale={thresholdScale}>
            {(labels) =>
              labels.reverse().map((label, i) => (
                <div key={`legend-quantile-outer-${i}`} className={styles.legendItem}>
                  {label.extent[0] && (
                    <LegendItem key={`legend-quantile-${i}`} margin="1px 0">
                      <svg width={20} height={20} className={styles.legendItemIcon}>
                        <rect fill={label.value} width={20} height={20} />
                      </svg>
                      <LegendLabel align="left" margin={0}>
                        {label.extent[0]} &ndash; {label.extent[1]}
                      </LegendLabel>
                    </LegendItem>
                  )}
                </div>
              ))
            }
          </LegendThreshold>
        )}
      </div>
    </div>
  )
}
