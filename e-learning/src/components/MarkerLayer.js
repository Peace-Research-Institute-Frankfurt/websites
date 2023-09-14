import * as styles from './LayeredMap.module.scss'
import React from 'react'
import { scaleOrdinal } from '@visx/scale'
import { LegendItem, LegendLabel, LegendOrdinal } from '@visx/legend'

export default function MarkerLayer({ markerGroupName, data, projection, renderLegend = false }) {
  const ordinalColorScale = scaleOrdinal({
    domain: [markerGroupName],
    range: ['#0F1A24FF'],
  })

  const convertDMSToDD = (coordinate) => {
    let dmsParts = coordinate.split(/[^\d\w]+/)
    let degrees = dmsParts[0]
    let minutes = dmsParts[1]
    let seconds = dmsParts[2]
    let direction = dmsParts[3]

    let dd = Number(degrees) + Number(minutes) / 60 + Number(seconds) / (60 * 60)

    if (direction === 'S' || direction === 'W') {
      dd = dd * -1
    }

    return dd
  }

  return (
    <>
      {!renderLegend ? (
        <g>
          {data.map((marker, i) => (
            <circle
              key={`markerCircle.${i}`}
              r={6}
              className={styles.marker}
              transform={`translate(${projection.projection([
                Number.isNaN(Number(marker.long)) ? convertDMSToDD(marker.long) : Number(marker.long),
                Number.isNaN(Number(marker.lat)) ? convertDMSToDD(marker.lat) : Number(marker.lat),
              ])})`}
            />
          ))}
        </g>
      ) : (
        <div>
          <LegendOrdinal scale={ordinalColorScale} labelFormat={(label) => `${label.toUpperCase()}`}>
            {(labels) => (
              <div>
                {labels.map((label, i) => (
                  <LegendItem key={`legend-quantile-${i}`} alignItems={'flex-start'}>
                    <svg width={20} height={20}>
                      <circle key={`markerCircle.${i}`} className={styles.circle} />
                    </svg>

                    <LegendLabel align="left" margin="0 0 0 10px">
                      {label.datum}
                    </LegendLabel>
                  </LegendItem>
                ))}
              </div>
            )}
          </LegendOrdinal>
        </div>
      )}
    </>
  )
}
