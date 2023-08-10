import React from 'react'
import { Graticule, NaturalEarth } from '@visx/geo'
import admin0 from '../data/ne_countries.json'
import MarkdownRenderer from 'react-markdown-renderer'
import * as styles from './Map.module.scss'

// https://github.com/airbnb/visx/issues/880

const Map = ({ caption, credit, children }) => {
  const width = 1500
  const ratio = 1.9
  const height = width / ratio

  const centerX = width / 2 - 35
  const centerY = height / 2 + 15
  const scale = (width + height) * 0.15

  return (
    <figure className={styles.container}>
      <NaturalEarth data={admin0.features} scale={scale} translate={[centerX, centerY]}>
        {(projection) => {
          return (
            <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={styles.map}>
              <Graticule outline={(path) => projection.path(path)} graticule={(g) => projection.path(g)} stroke="rgba(0, 0, 0, .1)" fill="none" />
              <g data-layer="admin0">
                {projection.features.map(({ feature, path }, i) => {
                  return (
                    <g key={i}>
                      <path className={styles.country} key={`map-feature-${i}`} d={path || ''} />
                    </g>
                  )
                })}
              </g>
              {React.Children.map(children, (child) => {
                return React.cloneElement(child, { projection: projection })
              })}
            </svg>
          )
        }}
      </NaturalEarth>
      {caption && (
        <figcaption className={styles.caption}>
          <MarkdownRenderer markdown={caption} />
        </figcaption>
      )}
      {credit && (
        <figcaption className={styles.credit}>
          <MarkdownRenderer markdown={credit} />
        </figcaption>
      )}
    </figure>
  )
}

const PointsLayer = () => {}

export { Map, PointsLayer }
