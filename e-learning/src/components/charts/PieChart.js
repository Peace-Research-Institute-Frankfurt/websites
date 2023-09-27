import React from 'react'
import { Pie } from '@visx/shape'
import { Group } from '@visx/group'
import * as styles from './Charts.module.scss'
import * as d3 from 'd3'
import { ParentSize } from '@visx/responsive'

import { LegendOrdinal } from '@visx/legend'
import { scaleOrdinal } from '@visx/scale'

export default function PieChart({ data, colorRangeStart = '#97aabd', colorRangeEnd = '#274868' }) {
  const value = (d) => d.value
  const pieSortValues = (a, b) => b - a

  const names = data.map((d, i) => `${i + 1} ${d.name}`)
  const minValue = data.reduce((min, c) => (c.value < min ? c.value : min), data[0].value)
  const maxValue = data.reduce((max, c) => (c.value > max ? c.value : max), data[0].value)
  const colorRange = d3.scaleLinear().domain([minValue, maxValue]).range([colorRangeStart, colorRangeEnd])
  const margin = { top: 20, right: 20, bottom: 20, left: 20 }

  const colorScale = scaleOrdinal({
    domain: names,
    range: Array.from(data, (x, i) => colorRange(x.value)),
  })

  return (
    <div className={styles.container}>
      <div className={styles.graphContainer}>
        <ParentSize>
          {({ width, height }) => {
            const innerWidth = width - margin.left - margin.right
            const innerHeight = height - margin.top - margin.bottom
            const radius = Math.min(innerWidth, innerHeight) / 2
            const centerY = innerHeight / 2
            const centerX = innerWidth / 2
            const top = centerY + margin.top
            const left = centerX + margin.left

            return (
              <svg width={width} height={height}>
                <Group top={top} left={left}>
                  <Pie data={data} pieValue={value} pieSortValues={pieSortValues} outerRadius={radius}>
                    {(pie) =>
                      pie.arcs.map((arc, index) => {
                        const [centroidX, centroidY] = pie.path.centroid(arc)
                        const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.1
                        const arcPath = pie.path(arc)
                        const arcFill = colorRange(arc.value)

                        return (
                          <g key={`arc-${arc.value}-${index}`}>
                            <path d={arcPath} fill={arcFill} />

                            {hasSpaceForLabel && (
                              <>
                                <text
                                  x={centroidX}
                                  y={centroidY}
                                  dy=".33em"
                                  fill="#ffffff"
                                  textAnchor="middle"
                                  pointerEvents="none"
                                  className={styles.pieChartLabelNumber}
                                >
                                  {index + 1}
                                </text>

                                <text
                                  x={centroidX}
                                  y={centroidY + 24}
                                  dy=".33em"
                                  fill="#ffffff"
                                  textAnchor="middle"
                                  pointerEvents="none"
                                  className={styles.pieChartLabel}
                                >
                                  ({arc.data.value})
                                </text>
                              </>
                            )}
                          </g>
                        )
                      })
                    }
                  </Pie>
                </Group>
              </svg>
            )
          }}
        </ParentSize>
      </div>

      <LegendOrdinal scale={colorScale} direction="row" labelMargin="0 15px 0 0" className={styles.pieChartLegend} />
    </div>
  )
}
