import adapter from 'gatsby-adapter-netlify'
import remarkGfm from 'remark-gfm'
import path from 'path'
import { fileURLToPath } from 'url'

// __dirname & __filename für ESM-kompatible Auflösung
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Wrapper für rehype-Plugins, wenn nötig (dynamisches Importieren von ESM)
const wrapESMPlugin = (name) =>
  function wrapESM(opts) {
    return async (...args) => {
      const mod = await import(name)
      const plugin = mod.default(opts)
      return plugin(...args)
    }
  }

const config = {
  siteMetadata: {
    siteUrl: 'https://eunpdc-elearning.netlify.app',
    title: 'EUNPDC E-Learning',
    description:
      "This course aims to cover all aspects of the European Union's non-proliferation and disarmament agenda and provide a comprehensive knowledge resource.",
    siteTwitter: '@PRIF_org',
    authorTwitter: '@PRIF_org',
    image: {
      src: '/social-image.png',
      alt: 'Stylised text: EU Non-Proliferation and Disarmament Consortium eLearning',
    },
  },

  pathPrefix: '/lu',

  flags: {
    FAST_DEV: true,
  },

  headers: [
    {
      source: '*',
      headers: [{ key: 'x-frame-options', value: 'SAMEORIGIN' }],
    },
  ],

  adapter: adapter.default(),

  plugins: [
    'gatsby-plugin-sass',
    'gatsby-plugin-image',
    'gatsby-transformer-sharp',
    'gatsby-transformer-json',
    'gatsby-transformer-csv',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        icon: 'src/assets/favicon.png',
      },
    },
    {
      resolve: 'gatsby-plugin-sharp',
      options: {
        defaults: {
          formats: ['auto', 'webp', 'avif'],
        },
      },
    },
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [wrapESMPlugin('rehype-slug')],
        },
        gatsbyRemarkPlugins: [
          'gatsby-remark-smartypants',
          'gatsby-plugin-remark-footnotes',
        ],
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'authors',
        path: `${__dirname}/content/authors/`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'data',
        path: `${__dirname}/content/data/`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'luContent',
        path: `${__dirname}/content/learning-units/`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'pages',
        path: `${__dirname}/content/pages/`,
      },
    },
  ],
}

export default config
