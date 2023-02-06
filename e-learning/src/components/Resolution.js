import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import CheckIcon from '../assets/icons/check.svg'
import CrossIcon from '../assets/icons/cross.svg'
import { Expandable } from '@prif/shared'
import * as styles from './Resolution.module.scss'
import * as buttonStyles from './Button.module.scss'

export default function Resolution({ name }) {
  const data = useStaticQuery(graphql`
    query ResolutionQuery {
      resolutions: allResolutionsJson {
        nodes {
          name
          title
          meeting
          date: date(formatString: "DD MMMM YYYY")
          status
          text
          description
        }
      }
    }
  `)

  let res = null
  data.resolutions.nodes.forEach((node) => {
    if (node.name === name) {
      res = node
    }
  })

  const meta = [
    {
      label: 'Status',
      data: (
        <>
          {res.status === 'adopted' ? (
            <>
              <CheckIcon />
              Adopted {res.date}
            </>
          ) : (
            <>
              <CrossIcon />
              {res.status}
            </>
          )}
        </>
      ),
    },
    { label: 'Meeting', data: res.meeting },
  ]

  return (
    <section className={styles.container}>
      <Expandable buttonStyles={buttonStyles}>
        <span className={styles.eyebrow}>Resolution</span>
        <h2 className={styles.title}>
          {res.title}
          {res.text ? (
            <a className={styles.name} href={res.text}>
              {res.name}
            </a>
          ) : (
            <span className={styles.name}>{res.name}</span>
          )}
        </h2>
        <p className={styles.meta}>
          {meta.map((el) => {
            return (
              <span key={el.label} className={styles.metaItem}>
                {el.data}
              </span>
            )
          })}
        </p>
        <p>{res.description}</p>
      </Expandable>
    </section>
  )
}
