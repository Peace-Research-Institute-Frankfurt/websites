import React from 'react'
import admin0 from '../data/ne_countries.json'

export default function CountriesLayer({ projection }) {
  console.log(admin0)
  // return (
  //   <g data-layer="admin0">
  //     {admin0.features.map(({ feature }, i) => {
  //       return (
  //         <g key={i} data-admin={feature.properties.ADMIN}>
  //           <path className={'styles.country'} key={`map-feature-${i}`} d={projection.path(feature.geometry) || ''} />
  //         </g>
  //       )
  //     })}
  //   </g>
  // )
  return <></>
}
