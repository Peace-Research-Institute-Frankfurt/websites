import * as styles from './LayeredMap.module.scss'
import React from 'react'

export default function MarkerLayerMarkers({ data, projection }) {
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
  )
}
