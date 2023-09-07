import React from 'react'
import * as styles from './LayeredMap.module.scss'
import {Graticule, NaturalEarth} from '@visx/geo'
import {LegendThreshold, LegendItem, LegendLabel, LegendOrdinal} from '@visx/legend';
import {scaleThreshold, scaleOrdinal} from '@visx/scale';
import {graphql, useStaticQuery} from 'gatsby'
import admin0 from '../../../prif-review/src/data/ne_countries.json'
import {geoMercator} from "d3-geo";
import * as d3 from "d3";


export default function LayeredMap({
                                       centerPos = {lat: 45, long: 85},
                                       mapScale = 1,
                                       valueGroupName,
                                       legendSize = 5,
                                       roundLegendValues = true,
                                       markerGroupName
}) {

    const data = useStaticQuery(graphql`
    query {
      countries: allTreatiesJson(filter: { name: { eq: "cwc" } }) {
        nodes {
          name
          participants {
            country {
              alpha2
            }
          }
        }
      }
    }
  `)

    // @todo change DMS to dd korrdinates - done
    // @todo make center and zoom to prop - done
    // @todo make color a range of colours depending on value - done
    // @todo legende - done
    // @todo extra layer for marker and country
    // @todo stylen und responsive machen
    // @todo read country values and markers vom csv

    // @todo auslagern in layers

    const mapScales = new Map()
    mapScales.set(1, 0.145)
    mapScales.set(2, 0.25)
    mapScales.set(3, 0.35)
    mapScales.set(4, 0.45)
    mapScales.set(5, 0.55)
    mapScales.set(6, 0.65)
    mapScales.set(7, 0.75)
    mapScales.set(8, 0.85)
    mapScales.set(9, 0.95)
    mapScales.set(10, 1)

    const width = 1500
    const ratio = 1.85
    const height = width / ratio
    const scale = (width + height) * mapScales.get(mapScale)

    const centerX = width / 2 - (centerPos.long)
    // const centerX =  (width / 2 - (-54.467564))
    const centerY = height / 2 + (centerPos.lat)
    // const centerY = (height / 2 + (-10.541821))


    /** country values */

    const countryValues = [
        {
            name: 'Germany',
            ISO_A3_EH: 'DEU',
            value: 22
        },
        {
            name: 'United Kingdom',
            ISO_A3_EH: 'GBR',
            value: 56
        },
        {
            name: 'Ghana',
            ISO_A3_EH: 'GHA',
            value: 88
        },
        {
            name: 'Canada',
            ISO_A3_EH: 'CAN',
            value: 70
        }
    ]

    const minValue = countryValues.reduce((min, c) => c.value < min ? c.value : min, countryValues[0].value)
    const maxValue = countryValues.reduce((max, c) => c.value > max ? c.value : max, countryValues[0].value)

    const colorRange = d3.scaleLinear().domain([minValue, maxValue]).range(['#CDD9E4', '#274868'])


    const legendRangeFunc = (min, max, steps) => {
        let stepsize = (max - min) / steps;

        let pow = Math.trunc(Math.log10(stepsize)) - 1;
        stepsize = Math.trunc(stepsize / 10 ** pow) * 10 ** pow;

        let result = [min];
        min = Math.trunc(min / 10 ** pow) * 10 ** pow;
        for (let i = 0; i < steps - 1; i++) {
            min += stepsize;
            result.push(roundLegendValues ? Math.round(min): min.toFixed(2));
        }
        result.push(max);
        return result;
    }

    valueGroupName='Lorem Ipsum (in %)'
    const legendRange = legendRangeFunc(minValue, maxValue, legendSize)

    let legendColorRange= []
    legendRange.map((value) => {
        legendColorRange.push(colorRange(value))
    })


    const thresholdScale = scaleThreshold({
        domain: legendRange,
        range:  legendColorRange
    });

    /** @todo make variables dynamic from csv file
     * marker functions
     * */

    /** markers */
    const translate = [centerX, centerY];
    const markerProjection = geoMercator().scale(scale).translate(translate);

    //matching example map-example-locations.csv or russian-nuclear-sites
    const markers = [
        {
            name: 'Dombarovskiy',
            lat: '51°01’27.29”N',
            // lat: '51.02425',
            long: '59°47’58.11”E',
            // long: '59.79948',
            variant: 'RS-20',
            description: 'ICBM Base for Silo Launchers of ICBMs'
        },
        {
            name: 'Uzhur',
            lat: '55°16’05.74”N',
            // lat: '55.26826',
            long: '89°44’50.15”E',
            // long: '89.74726',
            variant: 'RS-20',
            description: 'ICBM Base for Silo Launchers of ICBMs'
        },
        {
            name: 'Kozel’sk',
            lat: '53°56’37.77”N',
            // lat: '53.94383',
            long: '35°46’10.36”E',
            // long: '35.76954',
            variant: 'RS-18',
            description: 'ICBM Base for Silo Launchers of ICBMs'
        },
    ]

    /** for marker legend */
    markerGroupName = "Kraftwerk"
    const ordinalColorScale = scaleOrdinal({
        domain: [markerGroupName],
        range: ['#0F1A24FF'],
    });

    const convertDMSToDD = (input) => {
        let dmsParts = input.split(/[^\d\w]+/)
        let degrees = dmsParts[0]
        let minutes = dmsParts[1]
        let seconds = dmsParts[2]
        let direction = dmsParts[3]

        let dd = Number(degrees) + Number(minutes) / 60 + Number(seconds) / (60 * 60);

        if (direction === "S" || direction === "W") {
            dd = dd * -1;
        }

        return dd;
    }


    return (
        <div className={styles.container}>
            <h1> W&S TestMap </h1>

            <NaturalEarth
                data={admin0.features}
                scale={scale}
                translate={[centerX, centerY]}
            >
                {(projection) => {
                    return (
                        <svg viewBox={`0 0 ${width} ${height}`} className={styles.map}>
                            <Graticule outline={(path) => projection.path(path)} graticule={(g) => projection.path(g)}
                                       stroke="rgba(0, 0, 0, .05)" fill="none"/>
                            <g data-layer="admin0">

                                {projection.features.map(({feature, path}, i) => {

                                    const matchingCountry = countryValues.filter((country) => (country.ISO_A3_EH === feature.properties.ISO_A3_EH ? country.value : null))

                                    return (
                                        <g key={`feature.${i}`}>
                                            <path
                                                className={styles.country}
                                                key={`map-feature-${i}`}
                                                d={path || ''}
                                                fill={
                                                    matchingCountry.length > 0 && matchingCountry[0].value ?
                                                        colorRange(matchingCountry[0].value) :
                                                        '#9d9d9d'
                                                }
                                                stroke={'#ffffff'}
                                            />
                                        </g>
                                    )
                                })}


                                {/* marker */}
                                <g>
                                    {markers.map((marker, i) => (
                                        <circle
                                            key={`markerCircle.${i}`}
                                            r={6}
                                            className={styles.circle}
                                            transform={`translate(${markerProjection([
                                                Number.isNaN(Number(marker.long)) ? convertDMSToDD(marker.long) : Number(marker.long),
                                                Number.isNaN(Number(marker.lat)) ? convertDMSToDD(marker.lat) : Number(marker.lat),
                                            ])})`}
                                        />

                                    ))}
                                </g>
                            </g>

                        </svg>
                    )
                }}
            </NaturalEarth>

            <div className="legend">
                <div className="title">{valueGroupName}</div>
                <LegendThreshold scale={thresholdScale}>
                {(labels) =>
                    labels.reverse().map((label, i) => (
                        <>

                        <LegendItem
                            key={`legend-quantile-${i}`}
                            margin="1px 0"
                        >
                            <svg width={20} height={20}>
                                <rect fill={label.value} width={20} height={20} />
                            </svg>
                            <LegendLabel align="left" margin="2px 0 0 10px">
                                { label.extent[0]? `${label.extent[0]} - ` : `< ` } { label.extent[1] }
                            </LegendLabel>
                        </LegendItem>
                        </>
                    ))}
            </LegendThreshold>
            </div>
            <div className="legend">

                <LegendOrdinal scale={ordinalColorScale} labelFormat={(label) => `${label.toUpperCase()}`}>
                    {(labels) => (
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            {labels.map((label, i) => (
                                <LegendItem
                                    key={`legend-quantile-${i}`}
                                    margin="0 5px"
                                >
                                    <svg width={20} height={20}>

                                        <circle
                                            key={`markerCircle.${i}`}
                                            r={10}
                                            cx="10" cy="10"
                                            className={styles.circle}
                                        />

                                    </svg>

                                    <LegendLabel align="left" margin="0 0 0 4px">
                                        {label.text}
                                    </LegendLabel>
                                </LegendItem>
                            ))}
                        </div>
                    )}
                </LegendOrdinal>
            </div>
        </div>
    )
}
