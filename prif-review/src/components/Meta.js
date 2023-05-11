import { graphql, useStaticQuery } from 'gatsby'
import React from 'react'
export default function Meta({ title, description, image, url, children }) {
  const defaultData = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          description
          siteTwitter
          authorTwitter
          siteUrl
          image {
            src
            alt
          }
        }
      }
    }
  `)
  const fallback = defaultData.site.siteMetadata

  let data = {
    url: url || fallback.siteUrl,
    title: title || fallback.title,
    description: description || fallback.description,
    image: {
      src: `${fallback.siteUrl}${image?.src || fallback.image.src}`,
      alt: image?.alt || fallback.image.alt,
    },
    siteTwitter: fallback.siteTwitter,
  }
  return (
    <>
      <title>{data.title}</title>
      <meta name="description" content={data.description} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={data.url} />
      <meta name="twitter:title" content={data.title} />
      <meta name="twitter:description" content={data.description} />
      <meta name="twitter:image" content={data.image.src} />
      <meta name="twitter:image:alt" content={data.image.alt} />
      <meta name="twitter:creator" content={data.authorTwitter} />
      <meta name="twitter:site" content={data.siteTwitter} />

      <meta property="og:url" content={data.url} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={data.title} />
      <meta property="og:description" content={data.description} />
      <meta property="og:image" content={data.image.src} />
      <meta property="og:image:alt" content={data.image.alt} />
      <meta name="author" content={data.siteTitle} />

      {children}
    </>
  )
}
