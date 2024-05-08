import React from 'react'
import { NaturalEarth } from '@visx/geo'
import admin0 from '../data/ne_countries.json'
import MarkdownRenderer from 'react-markdown-renderer'
import * as styles from './Map.module.scss'

// https://github.com/airbnb/visx/issues/880

const Map = ({ caption, credit, children }) => {
  const width = 1500
  const ratio = 1.85
  const height = width / ratio

  const centerX = width / 2 - 85
  const centerY = height / 2 + 45
  const scale = (width + height) * 0.145

  return (
    <figure className={styles.container}>
      <NaturalEarth data={admin0.features} scale={scale} translate={[centerX, centerY]}>
        {(projection) => {
          return (
            <svg viewBox={`0 0 ${width} ${height}`} className={styles.map}>
              <g data-layer="admin0">
                {projection.features.map(({ path }, i) => {
                  return (
                    <g key={`feature.${i}`}>
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
          <MarkdownRenderer options={{ html: true }} markdown={caption} />
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
