import * as styles from './LayeredMap.module.scss'
import React from 'react'
import { LegendOrdinal, LegendThreshold } from '@visx/legend'
import { scaleThreshold } from '@visx/scale'
import { min, max } from 'd3'

const computeThresholdValues = (min, max, steps, round) => {
  let stepsize = (max - min) / steps

  let pow = Math.trunc(Math.log10(stepsize)) - 1
  stepsize = Math.trunc(stepsize / 10 ** pow) * 10 ** pow

  let result = [min]
  min = Math.trunc(min / 10 ** pow) * 10 ** pow

  for (let i = 0; i < steps - 1; i++) {
    min += stepsize
    result.push(round ? Math.round(min) : min.toFixed(2))
  }

  result.push(max)
  return result
}

export default function CountryStatisticsLayerLegend({ data, dataType, roundLegendValues, legendSize, statisticsGroupName, scale }) {
  const values = data.map((el) => el.value)
  let legendScale = null

  if (dataType === 'numerical') {
    const legendRange = computeThresholdValues(min(values), max(values), parseInt(legendSize), roundLegendValues)
    const legendColorRange = legendRange.map((value) => scale && scale(value))
    legendScale = scaleThreshold({
      domain: legendRange,
      range: legendColorRange,
    })
  } else if (dataType === 'categorical') {
    legendScale = scale
  }

  return (
    <div>
      <div className={styles.legendTitle}>{statisticsGroupName}</div>
      {dataType === 'categorical' && (
        <LegendOrdinal scale={legendScale}>
          {(labels) =>
            labels.map((label, i) => (
              <li key={`legend-item-${i}`} className={styles.legendItem}>
                <svg width={10} height={10} viewBox="0 0 10 10" className={styles.legendItemIcon}>
                  <rect fill={label.value} width={10} height={10} />
                </svg>
                {label.datum}
              </li>
            ))
          }
        </LegendOrdinal>
      )}
      {dataType === 'numerical' && (
        <LegendThreshold scale={legendScale}>
          {(labels) =>
            labels.reverse().map((label, i) => (
              <li key={`legend-item-${i}`} className={styles.legendItem}>
                <svg width={15} height={15} className={styles.legendItemIcon}>
                  <rect fill={label.value} width={20} height={20} />
                </svg>
                {label.extent[0]}–{label.extent[1]}
              </li>
            ))
          }
        </LegendThreshold>
      )}
    </div>
  )
}
