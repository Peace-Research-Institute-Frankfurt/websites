import React from 'react'
import * as styles from './FallbackIllustration.module.scss'

const FallbackIllustration = ({ category }) => {
  const colCount = 20
  const cellCount = 8
  const width = 100
  const height = 150
  const heights = [40, 20, 15, 25, 45, 30, 30, 20, 13, 30, 20, 10, 70, 10]
  const offsets = [20, 5, 10, 62, 14, 30, 81, 2, 33, 70, 10, 80, 20, 3, 38, 13]
  const scale = 1.5
  const colWidth = width / 8
  const angles = [0, 35, 90, 125]
  const angle = angles[['mensch', 'raum', 'tool', 'meta'].indexOf(category)]

  let colsFixed = []
  let colsScroll = []

  for (let i = 0; i < colCount; i++) {
    let cellsScroll = []
    let cellsFixed = []
    let currentY = 0
    for (let j = 0; j < cellCount; j++) {
      const cellHeight = heights[j] * scale
      const cell = (
        <rect
          key={`cell.${i}`}
          className={styles.cell}
          x={colWidth * i - width * 0.5 - colWidth / 2}
          y={currentY}
          width={colWidth}
          height={cellHeight}
          strokeWidth="0.1"
          ry={colWidth * 0.5}
          rx={colWidth * 0.5}
        />
      )
      if (j % 2 === 0) {
        cellsFixed.push(cell)
      } else {
        cellsScroll.push(cell)
      }
      currentY += cellHeight
    }
    const colTransform = `translate(0 ${-1 * offsets[i] - i})`
    colsFixed.push(
      <g key={`cols.${i}`} transform={colTransform}>
        {cellsFixed}
      </g>
    )
    colsScroll.push(
      <g key={`cols.${i}`} transform={colTransform}>
        {cellsScroll}
      </g>
    )
  }

  return (
    <div className={`${styles.container} ${styles[category]}`}>
      <svg vectorEffect="non-scaling-stroke" viewBox={`0 0 ${width} ${height}`} className={styles.fixed}>
        <g transform={`rotate(${angle} 50 50)`}>{colsFixed}</g>
      </svg>
      <svg vectorEffect="non-scaling-stroke" viewBox={`0 0 ${width} ${height}`} className={styles.scroll}>
        <g transform={`rotate(${angle} 50 50)`}>{colsScroll}</g>
      </svg>
    </div>
  )
}

export default FallbackIllustration
