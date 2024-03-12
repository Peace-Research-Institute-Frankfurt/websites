import React from 'react'
import MarkerLayerLegend from './MarkerLayerLegend'
import MarkerLayerMarkers from './MarkerLayerMarkers'

export default function MarkerLayer({ markerGroupName, data, projection, renderLegend = false }) {
  return renderLegend ? <MarkerLayerLegend markerGroupName={markerGroupName} /> : <MarkerLayerMarkers data={data} projection={projection} />
}
