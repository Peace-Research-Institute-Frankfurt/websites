import React from 'react'
import * as styles from './LayeredMap.module.scss'
import { NaturalEarth } from '@visx/geo'
import admin0 from '../../../prif-review/src/data/ne_countries.json'
import MarkerMapLayer from './MarkerLayer'
import CountryStatisticsLayer from './CountryStatisticsLayer'
import MapLegend from './MapLegend'

export default function LayeredMap({
  children,
  centerLat = 0,
  centerLong = 0,
  mapScale = 1,
  legendPosition = 'top-left',
  title,
  description,
  legendTitle,
}) {
  const min = 263
  const max = 2000
  const scale = min + ((max - min) / 9) * (mapScale - 1)
  const center = [centerLong, centerLat]
  const width = 1438
  const ratio = 2.5
  const height = width / ratio
  const translate = [width / 2, height / 2]

  return (
    <figure className={styles.container}>
      <NaturalEarth data={admin0.features} scale={scale} translate={translate} center={center}>
        {(projection) => {
          return (
            <svg viewBox={`0 0 1438 777.2972972972973`} className={styles.map} role="image">
              {title && <title>{title}</title>}
              {description && <desc>{description}</desc>}
              <g data-layer="admin0" className={styles.baseMap}>
                {projection.features.map(({ path }, i) => {
                  return (
                    <g key={`feature.${i}`}>
                      <path key={`map-feature-${i}`} d={path || ''} />
                    </g>
                  )
                })}
              </g>

              {/** country statistics Layer */}
              {React.Children.map(children, (child) => {
                if (child.type === CountryStatisticsLayer) {
                  return React.cloneElement(child, {
                    projection: projection,
                  })
                }
              })}

              {/** marker Layer */}
              {React.Children.map(children, (child) => {
                if (child.type === MarkerMapLayer) {
                  return React.cloneElement(child, {
                    projection: projection,
                  })
                }
              })}
            </svg>
          )
        }}
      </NaturalEarth>

      <MapLegend children={children} legendPosition={legendPosition} legendTitle={legendTitle} />
    </figure>
  )
}
