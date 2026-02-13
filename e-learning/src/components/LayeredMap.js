import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { NaturalEarth } from '@visx/geo'
import MarkerMapLayer from './MarkerLayer'
import CountryStatisticsLayer from './CountryStatisticsLayer'
import MapLegend from './MapLegend'
import LicenseString from './LicenseString.js'
import MarkdownRenderer from 'react-markdown-renderer'
import admin0 from '../assets/ne_admin0.json'
import ExpandIcon from '@shared/assets/expand.svg'
import CollapseIcon from '@shared/assets/collapse.svg'
import * as styles from './LayeredMap.module.scss'
import * as figureStyles from './Figure.module.scss'

export default function LayeredMap({
  children,
  centerLat = 0,
  centerLong = 0,
  mapScale = 1,
  caption,
  credit,
  license,
  title,
  description,
  legendTitle,
  layout,
  legendPosition = 'top-left',
  expandable,
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [lightboxTargetEl, setLightboxTargetEl] = useState(null)

  // Prepare render target for lightboxes
  useEffect(() => {
    setLightboxTargetEl(document.querySelector('#lightboxes'))
  }, [setLightboxTargetEl])

  const handleKeyUp = (e) => {
    if (e.key === 'Escape') {
      setIsExpanded(false)
    }
  }

  if (!caption && title) {
    caption = title
  } else if (!title && caption) {
    title = caption
  }

  const min = 263
  const max = 2000
  const scale = min + ((max - min) / 9) * (mapScale - 1)
  const center = [centerLong, centerLat]
  const width = 1438
  const ratio = 2.5
  const height = width / ratio
  const translate = [width / 2, height / 2]

  const mapContent = (
    <NaturalEarth data={admin0.features} scale={scale} translate={translate} center={center}>
      {(projection) => {
        return (
          <svg viewBox={`0 0 1438 777.2972972972973`} className={styles.map} role="image">
            {title && <title>{title}</title>}
            {description && <desc>{description}</desc>}
            <g data-layer="admin0" className={styles.baseMap}>
              {projection.features.map(({ path, feature }, i) => {
                return path ? <path data-name={feature.properties.NAME} d={path} key={`feature.${i}`} /> : <></>
              })}
            </g>
            {/** country statistics Layer */}
            {React.Children.map(children, (child) => {
              if (child.type === CountryStatisticsLayer) {
                return React.cloneElement(child, {
                  projection: projection,
                })
              }
            })}
            {/** marker Layer */}
            {React.Children.map(children, (child) => {
              if (child.type === MarkerMapLayer) {
                return React.cloneElement(child, {
                  projection: projection,
                })
              }
            })}
          </svg>
        )
      }}
    </NaturalEarth>
  )

  return (
    <>
        <figure 
          onKeyUp={handleKeyUp} 
          className={`${styles.container} ${figureStyles[layout]}`}
          role="presentation"
          tabIndex={-1}
        >
        <div className={`${styles.mapContainer} ${figureStyles.imageContainer}`}>
          {mapContent}
          {expandable && (
            <button
              onClick={() => {
                setIsExpanded(!isExpanded)
              }}
              className={styles.expand}
            >
              <ExpandIcon />
              Expand
            </button>
          )}
          <MapLegend children={children} legendPosition={legendPosition} legendTitle={legendTitle} />
        </div>
        <figcaption className={figureStyles.captions}>
          {caption && <MarkdownRenderer className={figureStyles.caption} markdown={caption} />}
          <div className={figureStyles.credit}>
            {credit && <MarkdownRenderer markdown={credit} />}
            {license && <LicenseString license={license} />}
          </div>
        </figcaption>
      </figure>
      {expandable && lightboxTargetEl &&
        createPortal(
          <div className={`${styles.lightbox} ${isExpanded ? styles.lightboxActive : ''}`}>
            <div className={styles.lightboxMedia}>
              {mapContent}
              <button
                className={styles.collapse}
                onClick={() => {
                  setIsExpanded(false)
                }}
              >
                <CollapseIcon />
                Collapse
              </button>
            </div>
          </div>,
          lightboxTargetEl
        )}
    </>
  )
}