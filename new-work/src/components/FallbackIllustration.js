import React from 'react'
import * as styles from './FallbackIllustration.module.scss'

const FallbackIllustration = ({ category }) => {
  const colCount = 10
  const cellCount = 6
  const width = 100
  const height = 100
  const heights = [30, 20, 20, 45, 45, 30, 30, 20]
  const offsets = [20, 55, 10, 42, 14, 30, 81, 12, 33]
  const colWidth = width / colCount
  const angles = [0, 35, 90]
  const angle = angles[['mensch', 'raum', 'tool', ,].indexOf(category)]

  let cols = []

  for (let i = 0; i < colCount; i++) {
    let cells = []
    let currentY = 0
    for (let j = 0; j < cellCount; j++) {
      const cellHeight = heights[j]
      cells.push(
        <rect
          className={styles.cell}
          x={colWidth * i}
          y={currentY}
          width={width / colCount}
          height={cellHeight}
          stroke-width="0.1"
          ry={colWidth * 0.45}
          rx={colWidth * 0.45}
        />
      )
      currentY += cellHeight
    }
    cols.push(
      <g key={`cols.${i}`} className={styles.cols} transform={`translate(0 ${-1 * offsets[i]})`}>
        {cells}
      </g>
    )
  }

  return (
    <>
      <svg viewBox={`0 0 ${width} ${height}`} className={styles.container}>
        <g transform={`rotate(${angle} 50 50)`}>{cols}</g>
      </svg>
    </>
  )
}

export default FallbackIllustration
