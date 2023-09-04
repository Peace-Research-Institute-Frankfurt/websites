import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
import remarkGfm from 'remark-gfm'
import adapter from 'gatsby-adapter-netlify'

const config = {
  siteMetadata: {
    siteUrl: 'https://prif-review.netlify.app',
    title: 'PRIF Review',
    description: '',
    siteTwitter: '@HSFK_PRIF',
    authorTwitter: '@HSFK_PRIF',
    image: {
      src: '/social-image.png',
      alt: 'image alt',
    },
  },
  adapter: adapter(),
  plugins: [
    'gatsby-plugin-image',
    'gatsby-transformer-json',
    'gatsby-transformer-sharp',
    'gatsby-plugin-sass',
    'gatsby-transformer-csv',
    'gatsby-plugin-react-svg',
    {
      resolve: 'gatsby-plugin-sharp',
      options: {
        defaults: {
          formats: ['auto', 'webp', 'avif'],
        },
      },
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        icon: 'src/images/favicon.png',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'content',
        path: `${__dirname}/content/`,
      },
    },
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        mdxOptions: {
          remarkPlugins: [remarkGfm],
        },
        gatsbyRemarkPlugins: [
          {
            resolve: '../prif-gatsby-remark-smartypants',
            options: {
              locales: [
                {
                  openingQuotes: { single: '‚', double: '„' },
                  closingQuotes: { single: '’', double: '“' },
                  dashes: 'oldschool',
                  locale: 'de',
                },
                {
                  openingQuotes: { single: '‘', double: '“' },
                  closingQuotes: { single: '’', double: '”' },
                  dashes: 'oldschool',
                  locale: 'en',
                },
              ],
            },
          },
        ],
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/locales`,
        name: 'locale',
      },
    },
    {
      resolve: 'gatsby-plugin-react-i18next',
      options: {
        localeJsonSourceName: 'locale',
        languages: ['en', 'de'],
        defaultLanguage: 'de',
        fallbackLanguage: 'de',
        redirect: false,
        i18nextOptions: {
          interpolation: {
            escapeValue: false,
          },
          keySeparator: false,
          nsSeparator: false,
        },
        pages: [
          {
            matchPath: '/:lang?/:slug+', // Match all paths except the top-level index
            getLanguageFromPath: true,
          },
        ],
      },
    },
  ],
}

export default config
