import * as styles from './Charts.module.scss'
import React, {useId} from 'react'
import { Group } from '@visx/group'
import { curveBasis } from '@visx/curve'
import { LinePath } from '@visx/shape'
import { scaleLinear, scaleOrdinal, scaleTime } from '@visx/scale'
import { AxisBottom, AxisLeft } from '@visx/axis'
import { GridColumns, GridRows } from '@visx/grid'
import { ParentSize } from '@visx/responsive'
import * as d3 from 'd3'
import { LegendOrdinal } from '@visx/legend'

export default function LineChart({
  data,
  series,
  xAxis,
  xAxisTitle,
  yAxisTitle,
  colorRangeStart = '#6889a1',
  colorRangeEnd = '#203b54',
  xAxisDateOptions = { month: 'long' },
  title,
  description,
  legendTitle
}) {
  const xAxisKey = xAxis ? xAxis : Object.keys(data[0])[0]
  const margin = { top: 32, right: 30, bottom: 8, left: 32 }
  const axisLegendHeight = 44
  const keys = series ? series : Object.keys(data[0]).filter((d) => d !== xAxisKey)
  const graphId = useId()

  /** accessors */
  const xValue = (obj) => {
    if (isNaN(Number(obj[xAxisKey]))) {
      return new Date(obj[xAxisKey])
    }

    return obj[xAxisKey]
  }

  /** scales */
  const xValueMinMax = [Math.min(...data.map(xValue)), Math.max(...data.map(xValue))]

  /** use timeScale to deal with time Objects if xValues are Dates */
  const xScale = isNaN(Number(data[0][xAxisKey])) ? scaleTime({ domain: xValueMinMax }) : scaleLinear({ domain: xValueMinMax })

  const yScale = scaleLinear({
    domain: [
      Math.min(
        ...data.map((d) =>
          Math.min(
            ...keys.map((key) => {
              return d[key]
            })
          )
        )
      ),
      Math.max(
        ...data.map((d) =>
          Math.max(
            ...keys.map((key) => {
              return d[key]
            })
          )
        )
      ),
    ],
    nice: true,
  })

  const colorRange = d3
    .scaleLinear()
    .domain([0, keys.length - 1])
    .range([colorRangeStart, colorRangeEnd])

  const colorScale = scaleOrdinal({
    domain: keys,
    range: Array.from([...Array(keys.length)], (x, i) => colorRange(i)),
  })

  return (
    <div className={styles.container}>
      <div>
        <span aria-label={legendTitle??''} className={styles.srOnly}/>
        <LegendOrdinal scale={colorScale} direction="row" labelMargin="0 15px 0 0" className={styles.legend} />
      </div>
      <div>
        <ParentSize>
          {({ width, height }) => {
            const responsiveWidth = width < 800 ? 800 : width
            // bounds
            const xMax = responsiveWidth - margin.left - margin.right
            const yMax = height - margin.top - margin.bottom - axisLegendHeight

            xScale.range([0, xMax])
            yScale.range([yMax, 0])

            return (
              <div style={{ overflow: 'auto' }}>
                <svg className={styles.graphContainer} width={responsiveWidth} style={{ overflow: 'visible' }} aria-labelledby={`${title && `${graphId}-map-title`} ${title && `${graphId}-map-description`}`} role={'graphics-object'}>
                  {title && <title id={`${graphId}-map-title`}>{title}</title>}
                  {description && <desc id={`${graphId}-map-description`}>{description}</desc>}

                  <Group left={margin.left + 24} top={margin.top}>
                    <GridRows scale={yScale} width={xMax} height={yMax} stroke="#e0e0e0" />

                    <GridColumns scale={xScale} width={xMax} height={yMax} stroke="#e0e0e0" />

                    <line x1={xMax} x2={xMax} y1={0} y2={yMax} stroke="#e0e0e0" />

                    <AxisBottom
                      top={yMax}
                      scale={xScale}
                      numTicks={width > 520 ? 10 : 5}
                      tickFormat={(v) => (v instanceof Date ? v.toLocaleDateString('en-GB', xAxisDateOptions) : v)}
                      label={xAxisTitle ?? xAxisKey}
                      labelProps={{
                        className: styles.axisLabelBottom,
                        textAnchor: 'middle',
                      }}
                      tickClassName={styles.axisTicks}
                    />

                    <AxisLeft
                      scale={yScale}
                      label={yAxisTitle ? yAxisTitle : ''}
                      labelProps={{
                        className: styles.axisLabelLeft,
                        textAnchor: 'middle',
                      }}
                      tickClassName={styles.axisTicks}
                    />

                    {keys.map((column, i) => (
                      <LinePath
                        key={i}
                        data={data}
                        curve={curveBasis}
                        x={(d) => xScale(xValue(d)) ?? 0}
                        y={(d) => yScale(Number(d[column])) ?? 0}
                        stroke={colorScale(column)}
                        strokeWidth={1.0 + 0.7 * Number(i)}
                        strokeOpacity={1}
                      />
                    ))}
                  </Group>
                </svg>
              </div>
            )
          }}
        </ParentSize>
      </div>
    </div>
  )
}
