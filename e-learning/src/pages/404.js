import * as React from 'react'
import { Link } from 'gatsby'
import { useTranslation } from 'gatsby-plugin-react-i18next'
import { graphql } from 'gatsby'

const pageStyles = {
  color: '#232129',
  padding: '96px',
  fontFamily: '-apple-system, Roboto, sans-serif, serif',
}
const headingStyles = {
  marginTop: 0,
  marginBottom: 64,
  maxWidth: 320,
}

const paragraphStyles = {
  marginBottom: 48,
}
const codeStyles = {
  color: '#8A6534',
  padding: 4,
  backgroundColor: '#FFF4DB',
  fontSize: '1.25rem',
  borderRadius: 4,
}

const NotFoundPage = () => {
  const { t } = useTranslation()
  return (
    <main style={pageStyles}>
      <h1 style={headingStyles}>{t('404.title')}</h1>
      <p style={paragraphStyles}>
        {t('404.sorry')}
        <br />
        {process.env.NODE_ENV === 'development' ? (
          <>
            <br />
            Try creating a page in <code style={codeStyles}>src/pages/</code>.
            <br />
          </>
        ) : null}
        <br />
        <Link to="/">{t('404.goHome')}</Link>.
      </p>
    </main>
  )
}

export default NotFoundPage
export const Head = () => <title>Not found</title>

// Nötig damit gatsby-plugin-react-i18next die Locale-Daten lädt:
export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: { language: { eq: $language } }) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`