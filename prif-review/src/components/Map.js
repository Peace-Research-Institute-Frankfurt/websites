import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import { Graticule, NaturalEarth } from '@visx/geo'
import admin0 from '../data/ne_countries.json'
import * as styles from './Map.module.scss'

const Map = ({ caption, children }) => {
  const width = 1500
  const ratio = 1.55
  const height = width / ratio

  const centerX = width / 2 - 35
  const centerY = height / 2 + 35
  const scale = (width + height) * 0.165

  return (
    <figure className={styles.container}>
      <NaturalEarth data={admin0.features} scale={scale} translate={[centerX, centerY]}>
        {(projection) => {
          return (
            <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={styles.map}>
              <Graticule outline={(path) => projection.path(path)} graticule={(g) => projection.path(g)} stroke="rgba(53, 53, 53, .1)" fill="none" />
              <g data-layer="admin0">
                {projection.features.map(({ feature, path }, i) => {
                  return (
                    <g key={i} data-admin={feature.properties.ADMIN}>
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
      <figcaption className={styles.caption}>{caption}</figcaption>
    </figure>
  )
}

const CountriesLayer = () => {}
const PointsLayer = () => {}

export { Map }
