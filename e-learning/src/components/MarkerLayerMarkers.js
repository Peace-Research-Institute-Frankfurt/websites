import * as styles from './LayeredMap.module.scss'
import React from 'react'

const convertDMSToDD = (coordinate) => {
  const dmsParts = coordinate.split(/[^\d\w]+/)
  const degrees = dmsParts[0]
  const minutes = dmsParts[1]
  const seconds = dmsParts[2]
  const direction = dmsParts[3]

  let dd = Number(degrees) + Number(minutes) / 60 + Number(seconds) / (60 * 60)

  if (direction === 'S' || direction === 'W') {
    dd = dd * -1
  }

  return dd
}

export default function MarkerLayerMarkers({ data, projection }) {
  return (
    <g>
      {data
        .filter((el) => {
          return el.lat && el.long
        })
        .map((marker, i) => (
          <circle
            key={`markerCircle.${i}`}
            r={8}
            className={styles.marker}
            transform={`translate(${projection.projection([
              Number.isNaN(Number(marker.long)) ? convertDMSToDD(marker.long) : Number(marker.long),
              Number.isNaN(Number(marker.lat)) ? convertDMSToDD(marker.lat) : Number(marker.lat),
            ])})`}
          />
        ))}
    </g>
  )
}
