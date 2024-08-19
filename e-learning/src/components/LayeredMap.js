import React from 'react'
import { NaturalEarth } from '@visx/geo'
import MarkerMapLayer from './MarkerLayer'
import CountryStatisticsLayer from './CountryStatisticsLayer'
import MapLegend from './MapLegend'
import LicenseString from './LicenseString.js'
import MarkdownRenderer from 'react-markdown-renderer'
import admin0 from '../assets/ne_admin0.json'

import * as styles from './LayeredMap.module.scss'
import * as figureStyles from './Figure.module.scss'

export default function LayeredMap({
  children,
  centerLat = 0,
  centerLong = 0,
  mapScale = 1,
  caption,
  credit,
  license,
  title,
  description,
  legendTitle,
  layout,
  legendPosition = 'top-left',
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
    <figure className={`${styles.container} ${figureStyles[layout]}`}>
      <div className={`${styles.mapContainer} ${figureStyles.imageContainer}`}>
        <NaturalEarth data={admin0.features} scale={scale} translate={translate} center={center}>
          {(projection) => {
            return (
              <svg viewBox={`0 0 1438 777.2972972972973`} className={styles.map} role="image">
                {title && <title>{title}</title>}
                {description && <desc>{description}</desc>}
                <g data-layer="admin0" className={styles.baseMap}>
                  {projection.features.map(({ path, feature }, i) => {
                    return path ? <path data-name={feature.properties.NAME} d={path} key={`feature.${i}`} /> : <></>
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
      </div>
      <figcaption className={styles.captions}>
        {caption && <MarkdownRenderer className={styles.caption} markdown={caption} />}
        <div className={styles.credit}>
          {credit && <MarkdownRenderer markdown={credit} />}
          {credit && license && ' / '}
          {license && <LicenseString license={license} />}
        </div>
      </figcaption>
    </figure>
  )
}
