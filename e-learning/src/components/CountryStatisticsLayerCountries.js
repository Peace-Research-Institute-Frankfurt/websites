import React from 'react'

export default function CountryStatisticsLayerCountries({ projection, data, colorRange }) {
  return (
    <>
      {projection.features.map(({ feature, path }, i) => {
        const matchingCountry = data.filter((country) => (country.ISO_A3_EH === feature.properties.ISO_A3_EH ? country.value : null))
        return matchingCountry.length > 0 && matchingCountry[0].value ? (
          <g key={`feature.${i}`}>
            <path key={`map-feature-${i}`} d={path || ''} fill={colorRange(matchingCountry[0].value)} stroke={'#ffffff'} />
          </g>
        ) : null
      })}
    </>
  )
}
