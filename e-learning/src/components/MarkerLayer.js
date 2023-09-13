import * as styles from "./LayeredMap.module.scss";
import React, {useEffect} from "react";
import {scaleOrdinal} from '@visx/scale';
import {LegendItem, LegendLabel, LegendOrdinal} from '@visx/legend'
import Papa from 'papaparse'

export default function MarkerLayer({
                                        markerGroupName,
                                        dataSrc,
                                        projection,
                                        renderLegend = false
                                    }) {
  const [markers, setMarkers] = React.useState([]);

    useEffect(() => {
        const fetchParseData = async () => {


            if(dataSrc.includes('.csv')) {
                Papa.parse(dataSrc, {
                    download: true,
                    delimiter:",",
                    header: true,
                    complete: ((result) => {
                        setMarkers(result.data.filter((marker) => marker.lat && marker.long && marker.name ))
                    })
                })
            }
            if(dataSrc.includes('.json')) {
                return fetch(dataSrc)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        return setMarkers(responseJson.filter((marker) => marker.lat && marker.long && marker.name));
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        }

        fetchParseData()
    }, [dataSrc])

    const ordinalColorScale = scaleOrdinal({
        domain: [markerGroupName],
        range: ['#0F1A24FF'],
    });

    const convertDMSToDD = (coordinate) => {
        let dmsParts = coordinate.split(/[^\d\w]+/)
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
        <>
            {!renderLegend ?
                <g>
                    {markers.map((marker, i) => (
                        <circle
                            key={`markerCircle.${i}`}
                            r={6}
                            className={styles.circle}
                            transform={`translate(${projection.projection([
                                Number.isNaN(Number(marker.long)) ? convertDMSToDD(marker.long) : Number(marker.long),
                                Number.isNaN(Number(marker.lat)) ? convertDMSToDD(marker.lat) : Number(marker.lat),
                            ])})`}
                        />

                    ))}
                </g> :
                <div>
                    <LegendOrdinal scale={ordinalColorScale} labelFormat={(label) => `${label.toUpperCase()}`}>
                        {(labels) => (
                            <div>
                                {labels.map((label, i) => (
                                    <LegendItem
                                        key={`legend-quantile-${i}`}
                                        alignItems={'flex-start'}
                                    >
                                        <svg width={20} height={20}>

                                            <circle
                                                key={`markerCircle.${i}`}
                                                className={styles.circle}
                                            />

                                        </svg>

                                        <LegendLabel align="left" margin="0 0 0 10px">
                                            {label.datum}
                                        </LegendLabel>
                                    </LegendItem>
                                ))}

                            </div>
                        )}
                    </LegendOrdinal>
                </div>
            }
        </>

    )
}
