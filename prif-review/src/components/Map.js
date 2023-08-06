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
              <g>
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
              <g>{/* datapoints go here */}</g>
            </svg>
          )
        }}
      </NaturalEarth>
      <figcaption className={styles.caption}>{caption}</figcaption>
    </figure>
  )
}

const PRIFNetworkLayer = ({ projection }) => {
  const data = useStaticQuery(graphql`
    query PRIFNetworkLayerQuery {
      connections: allNetworkCsv {
        nodes {
          collaborations
          country
          guests
          residencies
        }
      }
    }
  `)
  const coordinates = [-73.9362, 40.73]
  const position = projection.projection([coordinates[0], coordinates[1]])

  let collaborations = []
  data.connections.nodes.forEach((node) => {
    if (node.collaborations && node.collaborations > 0) {
      collaborations.push({ country: node.country, count: node.collaborations })
    }
  })

  const collaborationsElements = data.connections.nodes.map((connection, i) => {
    // We'll look at the admin0 data to get the coordinates
    // of the country we're looking at
    const country = admin0.features.find((feature) => {
      return feature.properties.ISO_A3_EH === connection.country
    })

    if (!country) {
      console.log(`could not find ${connection.country}`)
      return null
    }

    const position = projection.projection([country.properties.LABEL_X, country.properties.LABEL_Y])

    const cols = 10
    const d = 12
    const padding = 1

    const icons = new Array(parseInt(connection.collaborations)).fill(null).map((_, i) => {
      const x = (i % cols) * (d + padding)
      const y = Math.floor(i / cols) * (d + padding)
      return <circle fill="#1f3564" key={`icon-${i}`} cx={x} cy={y} r={d / 2} />
    })

    return (
      <g key={`collaboration-${i}`} transform={`translate(${position[0]} ${position[1]})`}>
        {icons}
      </g>
    )
  })

  return <g>{collaborationsElements}</g>
}
const CountriesLayer = () => {}
const PointsLayer = () => {}

export { Map, PRIFNetworkLayer }
