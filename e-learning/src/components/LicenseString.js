import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'

export default function LicenseString({ license }) {
  const data = useStaticQuery(graphql`
    query LicenseStringQuery {
      licenses: allLicensesJson {
        nodes {
          title
          license_id
          url
        }
      }
    }
  `)

  // Let's find our license
  let licenseNode = null
  data.licenses.nodes.forEach((l) => {
    if (l.license_id === license) {
      licenseNode = l
    }
  })

  return <>Licensed under {licenseNode.url ? <a href={licenseNode.url}>{licenseNode.title}</a> : <>{licenseNode.title || license}</>}.</>
}
