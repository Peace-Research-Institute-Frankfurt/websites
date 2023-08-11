import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import * as styles from './PRIFNetworkLayer.module.scss'

const PRIFNetworkLayer = ({ projection }) => {
  const data = useStaticQuery(graphql`
    query PRIFNetworkLayerQuery {
      cooperations: allCooperationsCsv {
        nodes {
          cities
        }
      }
      guests: allGuestsCsv {
        nodes {
          name
          city
        }
      }
      residencies: allResidenciesCsv {
        nodes {
          city
        }
      }
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
  console.log(data)
  const stats = ['cooperations', 'guests', 'residencies']

  stats.forEach((stat) => {
    data[stat].nodes.forEach((node) => {
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
          connections.push({ type: stat, lat: data.cities.nodes[ci].lat, long: data.cities.nodes[ci].long, country: data.cities.nodes[ci].country })
        }
      })
    })
  })

  const connectionElements = connections
    .filter((el) => el.country !== 'de')
    .map((connection, i) => {
      const position = projection.projection([connection.long, connection.lat])
      const prifPosition = projection.projection([8.682222, 50.110556])
      const lineElement = (
        <g className={`${styles.connection} ${styles[connection.type]}`} key={`connection.${i}`}>
          <line x1={prifPosition[0]} y1={prifPosition[1]} x2={position[0]} y2={position[1]} />
          <circle cx={position[0]} cy={position[1]} r={9} />
        </g>
      )

      return lineElement
    })

  return <>{connectionElements}</>
}
export { PRIFNetworkLayer }
