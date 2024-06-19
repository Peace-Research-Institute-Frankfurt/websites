import React from 'react'
import * as d3 from 'd3'
import CountryStatisticsLayerLegend from './CountryStatisticsLayerLegend'
import CountryStatisticsLayerCountries from './CountryStatisticsLayerCountries'

export default function CountryStatisticsLayer({
  statisticsGroupName,
  data,
  legendSize = 5,
  roundLegendValues = true,
  projection,
  renderLegend = false,
  colors = ['#97aabd', '#274868'],
}) {
  if (data.length <= 0) return <></>

  // Infer data type
  const values = data.map((el) => el.value)
  const dataType = typeof values[0] === 'number' ? 'numerical' : 'categorical'

  let scale

  if (dataType === 'numerical') {
    scale = d3.scaleLinear().domain(d3.extent(values)).range(colors.slice(0, 2))
  } else if (dataType === 'categorical') {
    scale = d3.scaleOrdinal([...new Set(data.map((el) => el.value))], colors)
  }

  if (renderLegend) {
    return (
      <CountryStatisticsLayerLegend
        data={data}
        dataType={dataType}
        scale={scale}
        legendSize={legendSize}
        roundLegendValues={roundLegendValues}
        statisticsGroupName={statisticsGroupName}
      />
    )
  } else {
    return <CountryStatisticsLayerCountries projection={projection} data={data} colorRange={scale} />
  }
}
