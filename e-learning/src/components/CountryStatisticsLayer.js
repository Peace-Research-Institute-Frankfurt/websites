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
  colorRangeStart = '#97aabd',
  colorRangeEnd = '#274868',
}) {
  if (data.length <= 0) return <></>

  const minValue = data.reduce((min, c) => (c.value < min ? c.value : min), data[0].value)
  const maxValue = data.reduce((max, c) => (c.value > max ? c.value : max), data[0].value)

  const colorRange = d3.scaleLinear().domain([minValue, maxValue]).range([colorRangeStart, colorRangeEnd])

  if (renderLegend) {
    return (
      <CountryStatisticsLayerLegend
        minValue={minValue}
        maxValue={maxValue}
        roundLegendValues={roundLegendValues}
        legendSize={legendSize}
        statisticsGroupName={statisticsGroupName}
        colorRange={colorRange}
      />
    )
  }

  return <CountryStatisticsLayerCountries projection={projection} data={data} colorRange={colorRange} />
}
