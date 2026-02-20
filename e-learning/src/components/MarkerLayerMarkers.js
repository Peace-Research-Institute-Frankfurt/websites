import * as styles from './LayeredMap.module.scss'
import React from 'react'

const coordinateStringtoDecimal = (s) => {
  // Applying some simple heuristics to work out
  // what kind of coordinate strign we're looking at

  let d = 0
  const sign = s.match(/[SW]/g) ? -1 : 1

  // Decimal degrees, ie. 14.2 E
  if (s.match(/\d+(?:.\d+)? ?[NSEW]/g)) {
    d = parseFloat(s.replace(/ [NSEW]/g, ''))
  } else {
    // Degrees, minutes and seconds, ie. 55°45’27.79”N
    const dmsParts = s.split(/[^\d\w]+/)
    const degrees = dmsParts[0]
    const minutes = dmsParts[1]
    const seconds = dmsParts[2]
    d = Number(degrees) + Number(minutes) / 60 + Number(seconds) / (60 * 60)
  }

  return d * sign
}

export default function MarkerLayerMarkers({ data, scale, projection, getCategory }) {
  return (
    <g>
      {data.map((marker, i) => (
        <circle
          key={`markerCircle.${i}`}
          r={1}
          fill={scale(getCategory(marker))}
          className={styles.marker}
          transform={`translate(${projection.projection([
            Number.isNaN(Number(marker.long)) ? coordinateStringtoDecimal(marker.long) : Number(marker.long),
            Number.isNaN(Number(marker.lat)) ? coordinateStringtoDecimal(marker.lat) : Number(marker.lat),
          ])})`}
        />
      ))}
    </g>
  )
}
