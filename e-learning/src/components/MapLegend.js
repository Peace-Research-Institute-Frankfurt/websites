import * as styles from './LayeredMap.module.scss'
import React from 'react'
import MarkerMapLayer from './MarkerLayer'
import CountryStatisticsLayer from './CountryStatisticsLayer'

export default function MapLegend({ children, legendPosition, legendTitle }) {
  const className = legendPosition.split('-').reduce((a, b) => a.charAt(0).toUpperCase() + a.slice(1) + b.charAt(0).toUpperCase() + b.slice(1))

  return (
    <div className={`${styles.legends} ${styles[`position${className}`]}`}>
      <span aria-label={legendTitle??''} className={styles.srOnly}/>
      {/** marker Layer */}
      {React.Children.map(children, (child) => {
        if (child.type === MarkerMapLayer) {
          return (
            <div className={styles.legend}>
              {React.cloneElement(child, {
                renderLegend: true,
              })}
            </div>
          )
        }
      })}

      {/** country statistics Layer */}
      {React.Children.map(children, (child) => {
        if (child.type === CountryStatisticsLayer) {
          return (
            <div className={styles.legend}>
              {React.cloneElement(child, {
                renderLegend: true,
              })}
            </div>
          )
        }
      })}
    </div>
  )
}
