import * as styles from './LayeredMap.module.scss'
import React from 'react'

export default function CountryStatisticsLayerCountries({ projection, data, colorRange }) {
  return (
    <>
      {projection.features.map(({ feature, path }, i) => {
        const matchingCountry = data.filter((country) => (country.ISO_A3_EH === feature.properties.ISO_A3_EH ? country.value : null))

        return (
          <g key={`feature.${i}`}>
            <path
              className={styles.country}
              key={`map-feature-${i}`}
              d={path || ''}
              fill={matchingCountry.length > 0 && matchingCountry[0].value && colorRange ? colorRange(matchingCountry[0].value) : 'transparent'}
              stroke={'#ffffff'}
            />
          </g>
        )
      })}
    </>
  )
}
