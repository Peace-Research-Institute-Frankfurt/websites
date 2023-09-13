import React from 'react';
import * as styles from './LayeredMap.module.scss';
import {Graticule, NaturalEarth} from '@visx/geo';
import admin0 from '../../../prif-review/src/data/ne_countries.json';
import MarkerMapLayer from "./MarkerLayer";
import CountryStatisticsLayer from "./CountryStatisticsLayer";
import MapLegend from "./MapLegend";


export default function LayeredMap({
                                       children,
                                       centerLat = 0,
                                       centerLong = 0,
                                       mapScale = 1,
                                   }) {
    const min = 263;
    const max = 2000;
    const scale = min + (((max - min) / 9) * (mapScale - 1));
    const center = [centerLong, centerLat];
    const width = 1438
    const ratio = 1.85
    const height = width / ratio
    const translate = [width / 2, height / 2];

    return (
        <div className={styles.container}>
            <NaturalEarth
                data={admin0.features}
                scale={scale}
                translate={translate}
                center={center}
            >
                {(projection) => {
                    return (
                        <svg
                            viewBox={`0 0 1438 777.2972972972973`}
                            className={styles.map}>
                            <Graticule outline={(path) => projection.path(path)}
                                       graticule={(g) => projection.path(g)}
                                       stroke="rgba(0, 0, 0, .05)" fill="none"/>
                            <g data-layer="admin0">
                                {projection.features.map(({feature, path}, i) => {
                                    return (
                                        <g key={`feature.${i}`}>
                                            <path
                                                className={styles.country}
                                                key={`map-feature-${i}`}
                                                d={path || ''}
                                                fill={'#9d9d9d'}
                                                stroke={'#ffffff'}
                                            />
                                        </g>
                                    )
                                })}

                                {/** country statistics Layer */}
                                {React.Children.map(children, (child) => {
                                    if (child.type === CountryStatisticsLayer) {
                                        return React.cloneElement(child,
                                            {
                                                projection: projection
                                            }
                                        )
                                    }
                                })}

                                {/** marker Layer */}
                                {React.Children.map(children, (child) => {
                                    if (child.type === MarkerMapLayer) {
                                        return React.cloneElement(child,
                                            {
                                                projection: projection
                                            }
                                        )
                                    }
                                })}

                            </g>

                        </svg>
                    )
                }}
            </NaturalEarth>

            <MapLegend children={children}/>

        </div>
    )
}
