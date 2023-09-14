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

  /** legend: */
  const legendRangeFunc = (min, max, steps) => {
    let stepsize = (max - min) / steps

    let pow = Math.trunc(Math.log10(stepsize)) - 1
    stepsize = Math.trunc(stepsize / 10 ** pow) * 10 ** pow

    let result = [min]
    min = Math.trunc(min / 10 ** pow) * 10 ** pow

    for (let i = 0; i < steps - 1; i++) {
      min += stepsize
      result.push(roundLegendValues ? Math.round(min) : min.toFixed(2))
    }

    result.push(max)

    return result
  }

  const legendRange = legendRangeFunc(minValue, maxValue, Number(legendSize))

  const legendColorRange = legendRange.map((value) => colorRange && colorRange(value))

  return renderLegend ? (
    <CountryStatisticsLayerLegend legendRange={legendRange} legendColorRange={legendColorRange} statisticsGroupName={statisticsGroupName} />
  ) : (
    <CountryStatisticsLayerCountries projection={projection} data={data} colorRange={colorRange} />
  )
}
