import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import LoopVideo from './LoopVideo'

export default function LoopVideoAdapter({
  src,
  caption,
  credit,
  license,
}) {
  const data = useStaticQuery(graphql`
    query VideoLicensesQuery {
      licenses: allLicensesJson {
        nodes {
          title
          license_id
          url
        }
      }
    }
  `)

  // Lizenz finden
  let licenseNode = null
  data.licenses.nodes.forEach((l) => {
    if (l.license_id === license) {
      licenseNode = l
    }
  })

  return (
    <LoopVideo
      src={src}
      caption={caption}
      credit={credit}
      license={licenseNode}
    />
  )
}
