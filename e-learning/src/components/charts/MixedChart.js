import * as styles from './Charts.module.scss'
import React, { useId } from 'react'
import MarkdownRenderer from 'react-markdown-renderer'
import { Group } from '@visx/group'
import { Bar, LinePath } from '@visx/shape'
import { curveBasis } from '@visx/curve'
import { AxisBottom, AxisLeft } from '@visx/axis'
import { scaleLinear, scaleBand, scaleOrdinal } from '@visx/scale'
import { GridColumns, GridRows } from '@visx/grid'
import { ParentSize } from '@visx/responsive'
import * as d3 from 'd3'
import { LegendOrdinal } from '@visx/legend'

export default function MixedChart({
  lineData,
  barData,
  xAxis,
  xAxisTitle,
  yAxisTitle,
  colorRangeStart = '#FF5733', 
  colorRangeEnd = '#203b54',
  title,
  description,
  legendTitle,
  credit,
  caption
}) {
  // === Aus LineChart & BarGraph übernommen ===
  const margin = { top: 32, right: 30, bottom: 72, left: 32 }
  const axisLegendHeight = 44
  const graphId = useId()

  // Keys für Line und Bar
  const lineXKey = xAxis ? xAxis : Object.keys(lineData[0])[0]
  const lineYKey = Object.keys(lineData[0]).filter((d) => d !== lineXKey)[0]
  const barXKey = 'Period'
  const barYKey = 'Average'

  const keys = ['Annual Totals', '5-Year Averages']

  /** accessors - aus LineChart/BarGraph */
  const getLineX = (d) => {
    const val = d[lineXKey]
    if (isNaN(Number(val))) {
      return new Date(val)
    }
    return val
  }
  const getLineY = (d) => Number(d[lineYKey])
  const getBarX = (d) => d[barXKey]
  const getBarY = (d) => Number(d[barYKey])

  /** scales - wie in LineChart/BarGraph */
  const lineXMinMax = [Math.min(...lineData.map(getLineX)), Math.max(...lineData.map(getLineX))]
  
  const xScaleLine = isNaN(Number(lineData[0][lineXKey])) 
    ? scaleLinear({ domain: lineXMinMax }) 
    : scaleLinear({ domain: lineXMinMax })

  const xScaleBar = scaleBand({
    domain: barData.map(getBarX),
    padding: 0.2, // wie in BarGraph
  })

  const yScale = scaleLinear({
    domain: [
      Math.min(...lineData.map(getLineY), ...barData.map(getBarY), 0),
      Math.max(...lineData.map(getLineY), ...barData.map(getBarY))
    ],
    nice: true,
  })

  // ColorScale wie in LineChart/BarGraph
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
      {/* Legend wie in BarGraph */}
      <div>
        <span aria-label={legendTitle ?? ''} className={styles.srOnly} />
        <LegendOrdinal
          scale={colorScale}
          direction="row"
          labelMargin="0 18px 0 0"
          className={styles.legend}
          shape={(item) => (
            <svg className={styles.legendShape}>
              {item.datum === 'Annual Totals' ? (
                <line x1="0" y1="8" x2="16" y2="8" stroke={item.fill} strokeWidth="2" />
              ) : (
                <rect className={styles.legendShape} fill={item.fill} />
              )}
            </svg>
          )}
        />
      </div>

      <div>
        <ParentSize>
          {({ width, height }) => {
            const responsiveWidth = width < 800 ? 800 : width
            
            // bounds - wie in LineChart/BarGraph
            const xMax = responsiveWidth - margin.left - margin.right
            const yMax = height - margin.top - margin.bottom - axisLegendHeight

            // update scale ranges - wie in LineChart/BarGraph
            xScaleLine.range([0, xMax])
            xScaleBar.rangeRound([0, xMax])
            yScale.range([yMax, 0])

            return (
              <div style={{ overflow: 'auto' }}>
                <svg 
                  className={styles.graphContainer} 
                  width={responsiveWidth} 
                  style={{ overflow: 'visible' }} 
                  aria-labelledby={`${title && `${graphId}-map-title`} ${title && `${graphId}-map-description`}`} 
                  role={'graphics-object'}
                >
                  {title && <title id={`${graphId}-map-title`}>{title}</title>}
                  {description && <desc id={`${graphId}-map-description`}>{description}</desc>}

                  <Group left={margin.left + 24} top={margin.top}>
                    {/* Grid wie in LineChart */}
                    <GridRows scale={yScale} width={xMax} height={yMax} stroke="#e0e0e0" />
                    <GridColumns scale={xScaleLine} width={xMax} height={yMax} stroke="#e0e0e0" />
                    <line x1={xMax} x2={xMax} y1={0} y2={yMax} stroke="#e0e0e0" />

                    {/* Bars - wie in BarGraph strukturiert */}
                    {barData.map((d, i) => {
                      const barX = xScaleBar(getBarX(d))
                      const barY = yScale(getBarY(d))
                      const barHeight = yMax - barY
                      const barWidth = xScaleBar.bandwidth()

                      return barHeight > 0 && (
                        <Bar
                          key={`bar-${i}`}
                          x={barX}
                          y={barY}
                          width={barWidth}
                          height={barHeight}
                          fill={colorScale('5-Year Averages')}
                        />
                      )
                    })}

                    {/* Line - wie in LineChart */}
                    <LinePath
                      data={lineData}
                      curve={curveBasis}
                      x={(d) => xScaleLine(getLineX(d)) ?? 0}
                      y={(d) => yScale(getLineY(d)) ?? 0}
                      stroke={colorScale('Annual Totals')}
                      strokeWidth={2}
                      strokeOpacity={1}
                    />

                    {/* Axes - wie in LineChart/BarGraph */}
                    <AxisBottom
                      top={yMax}
                      scale={xScaleBar}
                      label={xAxisTitle ?? barXKey}
                      labelProps={{
                        className: styles.axisLabelBottom,
                        textAnchor: 'middle',
                        dy: 40,
                      }}
                      tickClassName={styles.axisTicks}
                      tickLabelProps={() => ({
                        angle: -45,
                        textAnchor: 'end',
                        fontSize: 10,
                        dx: -5,
                        dy: 5
                      })}
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
                  </Group>
                </svg>
              </div>
            )
          }}
        </ParentSize>
      </div>

      {/* Caption wie in BarGraph */}
      {(caption || credit) && (
        <figcaption className="Figure-module--captions--0fbd6">
          {caption && (
            <div>
              <MarkdownRenderer markdown={caption} />
            </div>
          )}
          {credit && (
            <MarkdownRenderer
              className="Figure-module--credit--a51d2"
              markdown={credit}
            />
          )}
        </figcaption>
      )}
    </div>
  )
}