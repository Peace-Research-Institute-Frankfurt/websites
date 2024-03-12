import React from 'react'
import { LegendItem, LegendLabel, LegendOrdinal } from '@visx/legend'
import { scaleOrdinal } from '@visx/scale'

export default function MarkerLayerLegend({ markerGroupName }) {
  const ordinalColorScale = scaleOrdinal({
    domain: [markerGroupName],
    range: ['#0F1A24FF'],
  })

  return (
    <div>
      <LegendOrdinal scale={ordinalColorScale} labelFormat={(label) => `${label.toUpperCase()}`}>
        {(labels) => (
          <div>
            {labels.map((label, i) => (
              <LegendItem key={`legend-quantile-${i}`} alignItems={'flex-start'}>
                <svg width={20} height={20}>
                  <circle key={`markerCircle.${i}`} />
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
  )
}
