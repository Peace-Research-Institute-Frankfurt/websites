import * as styles from './Charts.module.scss'
import React, { useId } from 'react'
import MarkdownRenderer from 'react-markdown-renderer'
import { Group } from '@visx/group'
import { Bar, LinePath } from '@visx/shape'
import { curveBasis } from '@visx/curve'
import { AxisBottom, AxisLeft } from '@visx/axis'
import { scaleLinear, scaleBand, scaleOrdinal } from '@visx/scale'
import { ParentSize } from '@visx/responsive'
import { LegendOrdinal } from '@visx/legend'
import { GridRows } from '@visx/grid'

export default function MixedChart({ 
  lineData, 
  barData, 
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
  const margin = { top: 32, right: 30, bottom: 72, left: 32 }
  const axisLegendHeight = 44
  const graphId = useId()

  const lineXKey = Object.keys(lineData[0])[0]
  const lineYKey = Object.keys(lineData[0])[1]
  const barYKey = 'Average'

  const getLineX = (d) => Number(d[lineXKey])
  const getLineY = (d) => Number(d[lineYKey])
  const getBarY = (d) => Number(d[barYKey])

  const allLineValues = lineData.map(getLineY)
  const allBarValues = barData.map(getBarY)
  const maxValue = Math.max(...allLineValues, ...allBarValues)
  const minValue = Math.min(...allLineValues, ...allBarValues, 0)

  const colorScale = scaleOrdinal({
    domain: ['Annual Totals', '5-Year Averages'],
    range: [colorRangeStart, colorRangeEnd],
  })

  return (
    <div className={styles.container}>
      <div>
        <div className={styles.srOnly}>{legendTitle ?? ''}</div>
        <LegendOrdinal
          scale={colorScale}
          direction="row"
          labelMargin="3px 18px 0 0"
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
            const xMax = responsiveWidth - margin.left - margin.right
            const yMax = height - margin.top - margin.bottom - axisLegendHeight

            const xScaleLine = scaleLinear({
              domain: [Math.min(...lineData.map(getLineX)), Math.max(...lineData.map(getLineX))],
              range: [0, xMax]
            })

            const xScaleBar = scaleBand({
              domain: barData.map(d => d.Period),
              range: [0, xMax],
              padding: 0.3
            })

            const yScale = scaleLinear({
              domain: [minValue, maxValue],
              range: [yMax, 0],
              nice: true,
            })

            const barWidth = xScaleBar.bandwidth()

            return (
              <div style={{ overflow: 'auto' }}>
                <svg 
                  className={styles.graphContainer} 
                  width={responsiveWidth} 
                  height={yMax + margin.top + margin.bottom + axisLegendHeight}
                  style={{ overflow: 'visible' }} 
                  aria-labelledby={`${title && `${graphId}-map-title`} ${description && `${graphId}-map-description`}`} 
                  role={'graphics-object'}
                >
                  {title && <title id={`${graphId}-map-title`}>{title}</title>}
                  {description && <desc id={`${graphId}-map-description`}>{description}</desc>}

                  <Group left={margin.left + 24} top={margin.top}>
                    <GridRows scale={yScale} width={xMax} height={yMax} stroke="#e0e0e0" />

                    {/* Balken */}
                    {barData.map((d, i) => {
                      const barHeight = yMax - yScale(getBarY(d))
                      const barX = xScaleBar(d.Period)
                      const barY = yScale(getBarY(d))

                      return (
                        <Bar
                          key={`bar-${i}`}
                          x={barX}
                          y={barY}
                          width={barWidth}
                          height={barHeight}
                          fill={colorScale('5-Year Averages')}
                         // fillOpacity={0.7}
                        />
                      )
                    })}

                    {/* Linie */}
                    <LinePath
                      data={lineData}
                      curve={curveBasis}
                      x={(d) => xScaleLine(getLineX(d)) ?? 0}
                      y={(d) => yScale(getLineY(d)) ?? 0}
                      stroke={colorScale('Annual Totals')}
                      strokeWidth={2}
                      strokeOpacity={1}
                    />

                    {/* X-Achse ohne Tick-Labels */}
                    <AxisBottom
                        label={xAxisTitle}
                        labelProps={{
                            className: styles.axisLabelBottom,
                            textAnchor: 'middle',
                            dy: 40, // verschiebt das Label nach unten (zuvor vielleicht 0)
                        }}
                        tickClassName={styles.axisTicks}
                        top={yMax}
                        scale={xScaleBar}
                        tickFormat={() => ''} // keine Tick-Labels
                    />

                    {/* Periodenlabels unterhalb der Balken */}
                    {barData.map((d, i) => {
                      const x = xScaleBar(d.Period) + barWidth / 2
                      return (
                        <text
                          key={`period-label-${i}`}
                          x={x}
                          y={yMax + 25}
                          textAnchor="end"
                          fontSize={10}
                          transform={`rotate(-45, ${x}, ${yMax + 25})`}
                          className={styles.axisTicks}
                        >
                          {d.Period}
                        </text>
                      )
                    })}

                    <AxisLeft
                      label={yAxisTitle}
                      labelProps={{ className: styles.axisLabelLeft, textAnchor: 'middle' }}
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

      {(caption || credit) && (
        <figcaption className="Figure-module--captions--0fbd6">
          {caption && <div><MarkdownRenderer markdown={caption} /></div>}
          {credit && <MarkdownRenderer className="Figure-module--credit--a51d2" markdown={credit} />}
        </figcaption>
      )}
    </div>
  )
}
