import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
import remarkGfm from 'remark-gfm'
import adapter from 'gatsby-adapter-netlify'

const config = {
  siteMetadata: {
    siteUrl: `https://leibniz-nw.netlify.app`,
    title: 'WorkNew@Leibniz',
    description: 'Neue Arbeitformen für Wissenschaft und Forschung',
    siteTwitter: '@HSFK_PRIF',
    authorTwitter: '@HSFK_PRIF',
    image: {
      src: '/social-image.png',
      alt: 'image alt',
    },
  },
  flags: {
    FAST_DEV: true,
  },
  adapter: adapter.default(),
  plugins: [
    'gatsby-plugin-image',
    'gatsby-transformer-json',
    'gatsby-transformer-sharp',
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
      resolve: 'gatsby-plugin-sass',
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
        name: 'posts',
        path: `${__dirname}/content/posts/`,
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
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'snippets',
        path: `${__dirname}/content/snippets/`,
      },
    },
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        mdxOptions: {
          remarkPlugins: [remarkGfm],
        },
        gatsbyRemarkPlugins: [],
      },
    },
  ],
}

export default config
