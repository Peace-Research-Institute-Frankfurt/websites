import React from 'react'
import * as styles from './IconChart.module.scss'

const path = (
  <path
    className={styles.person}
    d="M2 20V13H0V7C0 6.45 0.195833 5.97917 0.5875 5.5875C0.979167 5.19583 1.45 5 2 5H6C6.55 5 7.02083 5.19583 7.4125 5.5875C7.80417 5.97917 8 6.45 8 7V13H6V20H2ZM4 4C3.45 4 2.97917 3.80417 2.5875 3.4125C2.19583 3.02083 2 2.55 2 2C2 1.45 2.19583 0.979167 2.5875 0.5875C2.97917 0.195833 3.45 0 4 0C4.55 0 5.02083 0.195833 5.4125 0.5875C5.80417 0.979167 6 1.45 6 2C6 2.55 5.80417 3.02083 5.4125 3.4125C5.02083 3.80417 4.55 4 4 4Z"
  />
)

const IconChart = ({ n, label }) => {
  const cols = n > 80 ? 24 : 12
  const rows = Math.ceil(n / cols)
  const iconWidth = 8
  const iconHeight = 20
  const padding = 2

  const width = cols * (iconWidth + padding)
  const height = rows * (iconHeight + padding)

  const icons = new Array(n).fill(null).map((_, i) => {
    const x = (i % cols) * (width / cols)
    const y = Math.floor(i / cols) * (iconHeight + padding)
    return (
      <g key={`icon-${i}`} transform={`translate(${x} ${y})`}>
        {path}
      </g>
    )
  })

  return (
    <div className={`${styles.container} ${n > 80 && styles.double}`}>
      <svg className={styles.chart} viewBox={`0 0 ${width} ${height}`} xmlns="<http://www.w3.org/2000/svg>">
        {icons}
      </svg>
      <figcaption className={styles.caption}>
        <span className={styles.number}>{n}</span>
        {label && <span className={styles.label}>{label}</span>}
      </figcaption>
    </div>
  )
}

const IconChartGroup = ({ children }) => {
  return <figure className={styles.list}>{children}</figure>
}

export { IconChart, IconChartGroup }
