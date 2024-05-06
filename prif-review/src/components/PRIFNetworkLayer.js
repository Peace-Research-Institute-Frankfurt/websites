import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import * as styles from './PRIFNetworkLayer.module.scss'

const PRIFNetworkLayer = ({ cooperations, guests, residencies, projection }) => {
  const data = useStaticQuery(graphql`
    query PRIFNetworkLayerQuery {
      cities: allCitiesCsv {
        nodes {
          name
          lat
          long
          country
        }
      }
    }
  `)

  let connections = []
  const stats = [
    { label: 'cooperations', data: cooperations },
    { label: 'guests', data: guests },
    { label: 'residencies', data: residencies },
  ]

  stats.forEach((stat) => {
    stat.data.forEach((node) => {
      let cities = []
      if (node.cities) {
        cities = node.cities.split(';')
      } else {
        cities = [node.city]
      }
      cities.forEach((city) => {
        const ci = data.cities.nodes.findIndex((el) => {
          return el.name === city
        })
        if (ci !== -1) {
          connections.push({
            type: stat.label,
            lat: data.cities.nodes[ci].lat,
            long: data.cities.nodes[ci].long,
            city: data.cities.nodes[ci],
            country: data.cities.nodes[ci].country,
          })
        }
      })
    })
  })

  const prifPosition = projection.projection([8.682222, 50.110556])
  const connectionElements = connections
    .filter((el) => el.country !== 'de')
    .map((connection, i) => {
      const position = projection.projection([connection.long, connection.lat])
      const lineElement = (
        <g className={`${styles.connection} ${styles[connection.type]}`} key={`connection.${i}`}>
          <line x1={prifPosition[0]} y1={prifPosition[1]} x2={position[0]} y2={position[1]} />
          <circle cx={position[0]} cy={position[1]} r={8} />
        </g>
      )

      return lineElement
    })

  return (
    <>
      {connectionElements}
      <circle className={styles.prif} cx={prifPosition[0]} cy={prifPosition[1]} r={8} />
    </>
  )
}
export { PRIFNetworkLayer }
