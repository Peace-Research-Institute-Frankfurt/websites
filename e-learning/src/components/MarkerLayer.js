import React from 'react'
import { scaleOrdinal } from '@visx/scale'

import MarkerLayerLegend from './MarkerLayerLegend'
import MarkerLayerMarkers from './MarkerLayerMarkers'

export default function MarkerLayer({ label, data, projection, renderLegend = false }) {
  const dataCategories = data
    .map((d) => {
      return d.category
    })
    .filter((d) => {
      return typeof d !== 'undefined'
    })

  const scale = scaleOrdinal({
    domain: dataCategories.length > 0 ? [...new Set(dataCategories)] : [label],
    range: ['var(--blue-70)', 'var(--blue-30)', 'var(--yellow-60)', 'var(--yellow-20)', 'var(--orange-50)', 'var(--orange-20)'],
  })

  return renderLegend ? (
    <MarkerLayerLegend label={label} data={data} scale={scale} />
  ) : (
    <MarkerLayerMarkers data={data} scale={scale} projection={projection} />
  )
}
