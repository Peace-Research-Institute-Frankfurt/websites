import * as styles from './Charts.module.scss'
import React, {useId} from 'react'
import { Group } from '@visx/group'
import { BarGroup } from '@visx/shape'
import { AxisBottom, AxisLeft } from '@visx/axis'
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale'
import { ParentSize } from '@visx/responsive'
import * as d3 from 'd3'
import { LegendOrdinal } from '@visx/legend'
import { PatternCircles, PatternLines, PatternWaves } from '@visx/pattern'

export default function BarGraph({ data, xAxis, xAxisTitle, yAxisTitle, series, colorRangeStart = '#6889a1', colorRangeEnd = '#203b54', maxValue, title, description,legendTitle }) {
  const xAxisKey = xAxis ? xAxis : Object.keys(data[0])[0]
  const keys = series ? series : Object.keys(data[0]).filter((d) => d !== xAxisKey)
  const margin = { top: 32, right: 30, bottom: 8, left: 32 }
  const axisLegendHeight = 44
  const calculatedMaxVal = Math.max(...data.map((d) => Math.max(...keys.map((key) => Number(d[key])))))
  const graphId = useId()
  maxValue = maxValue && maxValue > calculatedMaxVal ? maxValue : calculatedMaxVal

  /** accessors */
  const getXAxis = (d) => d[xAxisKey]

  /** scales */
  const xScale = scaleBand({
    domain: data.map(getXAxis),
    padding: 0.2,
  })

  const barScale = scaleBand({
    domain: keys,
    padding: 0.1,
  })

  const yScale = scaleLinear({
    domain: [0, maxValue],
  })

  const colorRange = d3
    .scaleLinear()
    .domain([0, keys.length - 1])
    .range([colorRangeStart, colorRangeEnd])

  const colorScale = scaleOrdinal({
    domain: keys,
    range: Array.from([...Array(keys.length)], (x, i) => colorRange(i)),
  })

  const patternScale = scaleOrdinal({
    domain: keys,
    range: ['lines'],
  })

  // Patterns
  const components = {
    waves: PatternWaves,
    circles: PatternCircles,
    lines: PatternLines,
  }

  const getColoredPattern = (color, id, pattern) => {
    const PatternComponent = components[pattern]

    return <PatternComponent id={id} height={6} width={6} stroke={color} strokeWidth={3} orientation={['diagonal']} />
  }

  return (
    <div className={styles.container}>
      <div>
        <div className={styles.srOnly}>{legendTitle??''}</div>
        <LegendOrdinal
            scale={colorScale}
            direction="row"
            labelMargin="3px 18px 0 0"
            className={styles.legend}
            shape={(item) => (
                <svg className={styles.legendShape}>
                  <rect
                      className={styles.legendShape}
                      fill={keys.length > 2 ? (item.itemIndex % 2 !== 0 ? `url('#p-id-${item.itemIndex}')` : item.fill) : item.fill}
                  />
                </svg>
            )}
        />
      </div>

      <div>
        <ParentSize>
          {({ width, height }) => {
            const responsiveWidth = width < 800 ? 800 : width

            // bounds
            const xMax = responsiveWidth - margin.left - margin.right
            const yMax = height - margin.top - margin.bottom - axisLegendHeight

            // update scale output dimensions
            xScale.rangeRound([0, xMax])
            barScale.rangeRound([0, xScale.bandwidth()])
            yScale.range([yMax, 0])

            return (
              <div style={{ overflow: 'auto' }}>
                <svg className={styles.graphContainer} width={responsiveWidth} style={{ overflow: 'visible' }} aria-labelledby={`${title && `${graphId}-map-title`} ${title && `${graphId}-map-description`}`} role={'graphics-object'}>
                  {title && <title id={`${graphId}-map-title`}>{title}</title>}
                  {description && <desc id={`${graphId}-map-description`}>{description}</desc>}

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
                      {(barGroups) =>
                        barGroups.map((barGroup) => (
                          <Group key={`bar-group-${barGroup.index}-${barGroup.x0}`} left={barGroup.x0}>
                            {barGroup.bars.map((bar, i) => (
                              <g key={`bar-group-${barGroup.index}-${barGroup.x0}-${i}`}>
                                {getColoredPattern(bar.color, `p-id-${i}`, patternScale(bar.key))}

                                {bar.height > 0 &&
                                    <rect
                                        key={`bar-group-bar-${barGroup.index}-${bar.index}-${bar.value}-${bar.key}`}
                                        x={bar.x}
                                        y={bar.y}
                                        width={bar.width}
                                        height={bar.height}
                                        fill={barGroup.bars.length > 2 ? (i % 2 !== 0 ? `url('#p-id-${i}')` : bar.color) : bar.color}
                                    />
                                }

                              </g>
                            ))}
                          </Group>
                        ))
                      }
                    </BarGroup>

                    <AxisBottom
                      label={xAxisTitle ?? xAxisKey}
                      labelProps={{
                        className: styles.axisLabelBottom,
                        textAnchor: 'middle',
                      }}
                      tickClassName={styles.axisTicks}
                      top={yMax}
                      scale={xScale}
                    />

                    <AxisLeft
                      label={yAxisTitle}
                      labelProps={{
                        className: styles.axisLabelLeft,
                        textAnchor: 'middle',
                      }}
                      tickClassName={styles.axisTicks}
                      scale={yScale}
                    />
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
