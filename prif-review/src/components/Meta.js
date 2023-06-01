import { graphql, useStaticQuery } from 'gatsby'
import React from 'react'
import useTranslations from '../hooks/useTranslations'

export default function Meta({ title, description, image, url, translationData, children }) {
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
      allSitePage {
        nodes {
          path
          pageContext
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

  let translations = useTranslations(translationData, defaultData.allSitePage.nodes)

  const alternateLinks = translations.map((t, i) => {
    const path = `${defaultData.site.siteMetadata.siteUrl}/${t.path}`
    return <link key={`alternate-${i}`} rel="alternate" hrefLang={t.language} href={path} />
  })

  return (
    <>
      {translationData && <html lang={translationData.currentLanguage} />}

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

      {alternateLinks}

      {children}
    </>
  )
}
