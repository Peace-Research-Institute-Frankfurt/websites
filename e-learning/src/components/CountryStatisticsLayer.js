import * as styles from './LayeredMap.module.scss'
import React, {useEffect} from 'react'
import * as d3 from 'd3'
import {LegendItem, LegendLabel, LegendThreshold} from '@visx/legend'
import {scaleThreshold} from '@visx/scale'
import Papa from 'papaparse'

export default function CountryStatisticsLayer({
                                                   statisticsGroupName,
                                                   dataSrc,
                                                   legendSize = 5,
                                                   roundLegendValues = true,
                                                   projection,
                                                   renderLegend = false,
                                                   colorRangeStart = '#97aabd',
                                                   colorRangeEnd = '#274868',
                                               }) {
    const [countryValues, setCountryValues] = React.useState([])
    useEffect(() => {
        const fetchParseData = async () => {
            if (dataSrc.includes('.csv')) {
                Papa.parse(dataSrc, {
                    download: true,
                    delimiter: ',',
                    header: true,
                    complete: (result) => {
                        setCountryValues(result.data.filter((country) => country.ISO_A3_EH && country.value))
                    },
                })
            }

            if (dataSrc.includes('.json')) {
                return fetch(dataSrc)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        return setCountryValues(responseJson.filter((country) => country.ISO_A3_EH && country.value))
                    })
                    .catch((error) => {
                        console.error(error)
                    })
            }
        }

        fetchParseData()
    }, [dataSrc])

    if (countryValues.length <= 0) return <></>

    const minValue = countryValues.reduce((min, c) => (c.value < min ? c.value : min), countryValues[0].value)
    const maxValue = countryValues.reduce((max, c) => (c.value > max ? c.value : max), countryValues[0].value)
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

    let legendColorRange = []

    legendRange.map((value) => colorRange && legendColorRange.push(colorRange(value)))

    const thresholdScale = scaleThreshold({
        domain: legendRange,
        range: legendColorRange,
    })

    if (renderLegend) {
        return (
            <div>
                <div className={styles.legendTitle}>{statisticsGroupName}</div>
                <div className={styles.legendInner}>
                    {thresholdScale && (
                        <LegendThreshold scale={thresholdScale}>
                            {(labels) =>
                                labels.reverse().map((label, i) => (
                                    <div key={`legend-quantile-outer-${i}`} className={styles.legendItem}>
                                        {label.extent[0] && (
                                            <LegendItem key={`legend-quantile-${i}`} margin="1px 0">
                                                <svg width={20} height={20} className={styles.legendItemIcon}>
                                                    <rect fill={label.value} width={20} height={20}/>
                                                </svg>
                                                <LegendLabel align="left" margin={0}>
                                                    {label.extent[0]} &ndash; {label.extent[1]}
                                                </LegendLabel>
                                            </LegendItem>
                                        )}
                                    </div>
                                ))
                            }
                        </LegendThreshold>
                    )}
                </div>
            </div>
        )
    } else {
        return (
            <>
                {projection.features.map(({feature, path}, i) => {
                    const matchingCountry = countryValues.filter((country) => {
                        return country.ISO_A3_EH === feature.properties.ISO_A3_EH ? country.value : null
                    })

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
}
