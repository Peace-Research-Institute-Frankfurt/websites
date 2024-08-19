import React from 'react'

export default function CountryStatisticsLayerCountries({ projection, data, scale }) {
  return (
    <>
      {projection.features.map(({ feature, path }, i) => {
        const matchingCountry = data.filter((country) => (country.iso3 === feature.properties.ADM0_A3 ? country.value : null))
        return matchingCountry.length > 0 && matchingCountry[0].value ? (
          <g key={`feature.${i}`}>
            <path d={path || ''} fill={scale(matchingCountry[0].value)} stroke="var(--blue-90)" strokeWidth={1.5} />
          </g>
        ) : null
      })}
    </>
  )
}
