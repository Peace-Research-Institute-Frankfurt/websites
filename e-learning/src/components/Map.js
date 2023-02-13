import React, { useEffect, useRef } from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import mapboxgl from 'mapbox-gl'
import * as styles from './Map.module.scss'
import './mapbox.scss'

export default function Map({ caption }) {
  const data = useStaticQuery(graphql`
    query {
      treaties: allTreatiesJson(filter: { name: { eq: "cwc" } }) {
        nodes {
          name
          participants {
            country {
              alpha2
            }
          }
        }
      }
    }
  `)

  const containerRef = useRef()

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoibWF4a29laGxlciIsImEiOiJjbGJ1bG01azExazQ0M29xbnM4ZjN4MDIzIn0.wHQidKYkNnKzkt7etQa7rA'
    containerRef.current.innerHTML = ''
    const map = new mapboxgl.Map({
      container: containerRef.current,
      //   style: "mapbox://styles/maxkoehler/clbut1yqt003614pmprm2jnn8",
      style: 'mapbox://styles/maxkoehler/clbutx1dv002n14qfy1thccqf',
      zoom: 1.1,
      interactive: false,
      projection: 'naturalEarth',
      attributionControl: false,
    })

    const countryData = data.treaties.nodes[0].members

    map.on('load', () => {
      // https://docs.mapbox.com/vector-tiles/reference/mapbox-countries-v1
      map.addSource('countries', {
        type: 'vector',
        url: 'mapbox://mapbox.country-boundaries-v1',
      })

      const matchExpression = ['match', ['get', 'code']]

      for (const row of countryData) {
        const color = `rgb(50, 70, 102)`
        matchExpression.push(row, color)
      }

      matchExpression.push('rgba(0, 0, 0, 0)')

      map.addLayer(
        {
          id: 'countries-join',
          type: 'fill',
          source: 'countries',
          'source-layer': 'country_boundaries',
          paint: {
            'fill-color': matchExpression,
          },
        },
        'admin-1-boundary-bg'
      )
    })
  }, [data.treaties.nodes])

  return (
    <figure className={styles.container}>
      <div ref={containerRef} className={styles.map}></div>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
      <figcaption className={styles.credit}>
        <a href="https://www.mapbox.com/about/maps/">© Mapbox</a>
        <a href="https://www.openstreetmap.org/about/">© OpenStreetMap</a>
        <a
          href="https://apps.mapbox.com/feedback/?owner=maxkoehler&amp;id=clbutx1dv002n14qfy1thccqf&amp;access_token=pk.eyJ1IjoibWF4a29laGxlciIsImEiOiJjbGJ1bG01azExazQ0M29xbnM4ZjN4MDIzIn0.wHQidKYkNnKzkt7etQa7rA#/0/0/1"
          rel="noopener nofollow"
        >
          Improve this map
        </a>
      </figcaption>
    </figure>
  )
}
