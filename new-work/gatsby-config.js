require('dotenv').config()

module.exports = {
  siteMetadata: {
    siteUrl: `https://leibniz-nw.netlify.app`,
    title: 'Work New @Leibniz',
    description: 'Wie wir Räume, Kulturen und Netzwerke für die Zukunft gestalten.',
    siteTwitter: '@HSFK_PRIF',
    authorTwitter: '@HSFK_PRIF',
    image: {
      src: '/social-image.png',
      alt: 'image alt',
    },
  },
  plugins: [
    'gatsby-plugin-image',
    'gatsby-plugin-sitemap',
    'gatsby-transformer-json',
    'gatsby-transformer-sharp',
    'gatsby-plugin-netlify',
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
      options: {
        implementation: require('sass'),
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
          remarkPlugins: [require('remark-gfm')],
        },
        gatsbyRemarkPlugins: [
          {
            resolve: 'gatsby-remark-smartypants',
            // This will start to work in Gatsby 5.6, when we can use
            // gatsby-config.mjs to load a local version of this plugin
            // that uses the latest (ESM) version of retext-smartypants.
            options: {
              openingQuotes: { single: '‚', double: '„' },
              closingQuotes: { single: '‘', double: '“' },
              dashes: 'oldschool',
            },
          },
          'gatsby-plugin-remark-footnotes',
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-react-svg',
      options: {
        rule: {},
      },
    },
  ],
}
