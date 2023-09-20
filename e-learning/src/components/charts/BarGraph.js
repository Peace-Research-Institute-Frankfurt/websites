import * as styles from "./Charts.module.scss";
import React from 'react';
import {Group} from '@visx/group';
import {BarGroup} from '@visx/shape';
import {AxisBottom, AxisLeft} from '@visx/axis';
import {scaleBand, scaleLinear, scaleOrdinal} from '@visx/scale';
import {ParentSize} from "@visx/responsive";
import * as d3 from "d3";
import {LegendOrdinal} from '@visx/legend';


export default function BarGraph({
                                     data,
                                     xAxis,
                                     xAxisTitle,
                                     yAxisTitle,
                                     bars,
                                     colorRangeStart = '#6889a1',
                                     colorRangeEnd = '#203b54',
                                     maxValue
                                 }) {
    const xAxisKey = xAxis ? xAxis : Object.keys(data[0])[0]
    const keys = bars ? bars : Object.keys(data[0]).filter((d) => d !== xAxisKey);
    const margin = {top: 32, right: 30, bottom: 8, left: 32};
    const axisLegendHeight = 44
    const calculatedMaxVal = Math.max(...data.map((d) => Math.max(...keys.map((key) => Number(d[key])))))
    maxValue = maxValue && (maxValue > calculatedMaxVal) ? maxValue : calculatedMaxVal

    /** accessors */
    const getXAxis = (d) => d[xAxisKey];

    /** scales */
    const xScale = scaleBand({
        domain: data.map(getXAxis),
        padding: 0.2,
    });
    const barScale = scaleBand({
        domain: keys,
        padding: 0.1,
    });
    const yScale = scaleLinear({
        domain: [0, maxValue],
    });

    const colorRange = d3.scaleLinear().domain([0, (keys.length - 1)]).range([colorRangeStart, colorRangeEnd])
    const colorScale = scaleOrdinal({
        domain: keys,
        range: Array.from([...Array(keys.length)], (x, i) => colorRange(i)),
    });


    return (
        <div className={styles.container}>
            <LegendOrdinal scale={colorScale} direction="row" labelMargin="3px 18px 0 0"
                           className={styles.legend}/>
            <div>
            <ParentSize>
                {({width, height}) => {
                    const responsiveWidth = width < 800 ? 800 : width

                    // bounds
                    const xMax = responsiveWidth - margin.left - margin.right;
                    const yMax = height - margin.top - margin.bottom - axisLegendHeight;

                    // update scale output dimensions
                    xScale.rangeRound([0, xMax]);
                    barScale.rangeRound([0, xScale.bandwidth()]);
                    yScale.range([yMax, 0]);

                    return <div style={{overflow: 'scroll'}}>
                            <svg className={styles.graphContainer}
                                 width={responsiveWidth} style={{overflow: 'visible'}}>

                                <Group left={margin.left + 24} top={margin.top}>
                                    <BarGroup
                                        data={data}
                                        keys={keys}
                                        height={yMax}
                                        x0={getXAxis}
                                        x0Scale={xScale}
                                        x1Scale={barScale}
                                        yScale={yScale}
                                        color={colorScale}
                                        overflow={'scroll'}
                                    >
                                        {(barGroups) => {
                                            return barGroups.map((barGroup, groupIndex) => (
                                                <Group key={`bar-group-${barGroup.index}-${barGroup.x0}`}
                                                       left={barGroup.x0}>
                                                    {barGroup.bars.map((bar) => {
                                                        return <rect
                                                            key={`bar-group-bar-${barGroup.index}-${bar.index}-${bar.value}-${bar.key}`}
                                                            x={bar.x}
                                                            y={bar.y}
                                                            width={bar.width}
                                                            height={bar.height}
                                                            fill={bar.color}
                                                        />
                                                    })}
                                                </Group>
                                            ))
                                        }}
                                    </BarGroup>


                                    <AxisBottom
                                        label={xAxisTitle}
                                        labelProps={{className: styles.axisLabelBottom}}
                                        tickClassName={styles.axisTicks}
                                        top={yMax}
                                        scale={xScale}
                                    />
                                    <AxisLeft
                                        label={yAxisTitle}
                                        labelProps={{className: styles.axisLabelLeft}}
                                        tickClassName={styles.axisTicks}
                                        scale={yScale}
                                    />
                                </Group>
                            </svg>
                        </div>
                }}
            </ParentSize>
            </div>

        </div>);
}

