import * as styles from './LayeredMap.module.scss'
import React from 'react'
import { LegendItem, LegendLabel, LegendThreshold } from '@visx/legend'
import { scaleThreshold } from '@visx/scale'

export default function CountryStatisticsLayerLegend({ minValue, maxValue, roundLegendValues, legendSize, statisticsGroupName, colorRange }) {
  const legendRangeFunc = (min, max, steps) => {
    let stepsize = (max - min) / steps

    let pow = Math.trunc(Math.log10(stepsize)) - 1
    stepsize = Math.trunc(stepsize / 10 ** pow) * 10 ** pow

    let result = [min]
    min = Math.trunc(min / 10 ** pow) * 10 ** pow

    for (let i = 0; i < steps - 1; i++) {
      min += stepsize
      result.push(roundLegendValues ? Math.round(min) : min.toFixed(2))
    }

    result.push(max)

    return result
  }

  const legendRange = legendRangeFunc(minValue, maxValue, Number(legendSize))

  const legendColorRange = legendRange.map((value) => colorRange && colorRange(value))

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
