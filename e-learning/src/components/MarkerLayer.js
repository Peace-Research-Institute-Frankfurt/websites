import React from 'react'
import { scaleOrdinal } from '@visx/scale'

import MarkerLayerLegend from './MarkerLayerLegend'
import MarkerLayerMarkers from './MarkerLayerMarkers'

export default function MarkerLayer({ label, data, projection, renderLegend = false }) {
  const getCategory = (d) => d.variant ?? label

  const categories = [...new Set(data.map(getCategory))]

  const scale = scaleOrdinal({
    domain: categories,
    range: ['var(--blue-30)', 'var(--blue-50)', 'var(--blue-70)', 'var(--blue-90)', 'var(--yellow-60)', 'var(--yellow-40)', 'var(--yellow-20)', 'var(--orange-60)', 'var(--orange-40)', 'var(--orange-20)'],
  })

  return renderLegend ? (
    <MarkerLayerLegend label={label} data={data} scale={scale} getCategory={getCategory} />
  ) : (
    <MarkerLayerMarkers data={data} scale={scale} projection={projection} getCategory={getCategory} />
  )
}
