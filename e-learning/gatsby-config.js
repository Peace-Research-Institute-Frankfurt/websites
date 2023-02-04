const wrapESMPlugin = (name) =>
  function wrapESM(opts) {
    return async (...args) => {
      const mod = await import(name)
      const plugin = mod.default(opts)
      return plugin(...args)
    }
  }

module.exports = {
  siteMetadata: {
    siteUrl: 'https://eunpdc-elearning.netlify.app',
    title: 'EUNPDC E-Learning',
    description:
      "This course aimns to cover all aspects of the European Union's non-proliferation and disarmament agenda and provide a comprehensive knowledge resource.",
    siteTwitter: '@HSFK_PRIF',
    authorTwitter: '@HSFK_PRIF',
    image: {
      src: '/social-image.png',
      alt: 'Stylised text: EU Non-Proliferation and Disarmament Consortium eLearning',
    },
  },
  flags: {},
  pathPrefix: `/lu`,
  plugins: [
    'gatsby-plugin-sass',
    'gatsby-plugin-image',
    'gatsby-transformer-sharp',
    'gatsby-transformer-json',
    {
      resolve: 'gatsby-plugin-netlify',
      options: {
        headers: {
          '/*': ['X-Frame-Options: SAMEORIGIN'],
        },
      },
    },
    {
      resolve: 'gatsby-plugin-react-svg',
      options: {
        rule: {
          include: /icons/,
          omitKeys: ['xmlnsDc', 'xmlnsCc', 'xmlnsRdf', 'xmlnsSvg', 'xmlnsSodipodi', 'xmlnsInkscape'],
        },
      },
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        icon: 'src/assets/icons/favicon.svg',
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
          remarkPlugins: [require('remark-gfm')],
          rehypePlugins: [wrapESMPlugin('rehype-slug')],
        },
        gatsbyRemarkPlugins: ['gatsby-remark-smartypants', 'gatsby-plugin-remark-footnotes'],
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
        path: `${__dirname}/content/learning-units`,
      },
    },
    {
      resolve: 'gatsby-plugin-local-search',
      options: {
        name: 'chapters',
        engine: 'flexsearch',
        // engineOptions: 'speed',
        query: `
          {
            allFile(filter: { extension: { eq: "mdx" }, name: { ne: "index" }, sourceInstanceName: { eq: "luContent" } }) {
              nodes {
                id
                childMdx {
                  frontmatter {
                    title
                  }
                }
              }
            }
          }
        `,
        ref: 'id',
        index: ['title'],
        store: ['id', 'title'],
        normalizer: ({ data }) =>
          data.allFile.nodes.map((node) => ({
            id: node.id,
            title: node.childMdx.frontmatter.title,
          })),
      },
    },
  ],
}
