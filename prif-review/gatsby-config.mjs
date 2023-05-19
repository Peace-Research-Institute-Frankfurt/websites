import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
import remarkGfm from 'remark-gfm'
import smarty from '../prif-gatsby-remark-smartypants/index.js'
console.log(smarty.meta)

const config = {
  siteMetadata: {
    siteUrl: `https://prif-review.netlify.app`,
    title: 'PRIF Review',
    description: '',
    siteTwitter: '@HSFK_PRIF',
    authorTwitter: '@HSFK_PRIF',
    image: {
      src: '/social-image.png',
      alt: 'image alt',
    },
  },
  plugins: [
    'gatsby-plugin-image',
    'gatsby-transformer-json',
    'gatsby-transformer-sharp',
    'gatsby-plugin-netlify',
    'gatsby-plugin-sass',
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
        name: 'reports',
        path: `${__dirname}/content/reports/`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'pages',
        path: `${__dirname}/content/pages/`,
      },
    },
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        mdxOptions: {
          remarkPlugins: [
            remarkGfm,
            {
              resolve: '../prif-gatsby-remark-smartypants',
              options: {
                openingQuotes: { single: '‚', double: '„' },
                closingQuotes: { single: '’', double: '“' },
                dashes: 'oldschool',
              },
            },
          ],
        },
        gatsbyRemarkPlugins: [],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/locales`,
        name: `locale`,
      },
    },
    {
      resolve: `gatsby-plugin-react-i18next`,
      options: {
        localeJsonSourceName: `locale`,
        languages: [`en`, `de`],
        defaultLanguage: `de`,
        fallbackLanguage: `de`,
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
