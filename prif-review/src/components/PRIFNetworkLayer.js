import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import admin0 from '../data/ne_countries.json'
import * as styles from './PRIFNetworkLayer.module.scss'

const PRIFNetworkLayer = ({ projection }) => {
  const data = useStaticQuery(graphql`
    query PRIFNetworkLayerQuery {
      collaborations: allCollaborationsCsv {
        nodes {
          countries_a3
          is_new
        }
      }
      guests: allGuestsCsv {
        nodes {
          name
          country_a3
        }
      }
      residencies: allResidenciesCsv {
        nodes {
          country_a3
        }
      }
    }
  `)
  const coordinates = [-73.9362, 40.73]
  const position = projection.projection([coordinates[0], coordinates[1]])

  let countries = []
  console.log(data)
  const stats = ['guests', 'residencies', 'collaborations']

  stats.forEach((stat) => {
    data[stat].nodes.forEach((node) => {
      let countryCodes = []
      if (node.countries_a3) {
        countryCodes = node.countries_a3.split(',')
      } else {
        countryCodes = [node.country_a3]
      }
      countryCodes.forEach((code) => {
        const countryIndex = countries.findIndex((el) => {
          return el.a3 === code
        })
        if (countryIndex === -1) {
          countries.push({ a3: code, [stat]: 1 })
        } else {
          if (countries[countryIndex][stat]) {
            countries[countryIndex][stat] += 1
          } else {
            countries[countryIndex][stat] = 1
          }
        }
      })
    })
  })

  console.log(countries)

  const countryElements = countries.map((country, i) => {
    const geo = admin0.features.find((feature) => {
      return feature.properties.ISO_A3_EH === country.a3
    })

    if (!geo) {
      console.log(`could not find geometry for country "${country.a3}"`)
      return null
    }

    const position = projection.projection([geo.properties.LABEL_X, geo.properties.LABEL_Y])
    const prifPosition = projection.projection([8.682222, 50.110556])
    const cols = 10
    const d = 15
    const padding = 1
    let currentY = 0
    const statsElements = []
    const lineElement = (
      <>
        <line x1={prifPosition[0]} y1={prifPosition[1]} x2={position[0]} y2={position[1]} stroke="black" />
        <circle cx={position[0]} cy={position[1]} r={6} fill="black" />
      </>
    )

    return <>{lineElement}</>
  })

  return <g>{countryElements}</g>
}
export { PRIFNetworkLayer }
