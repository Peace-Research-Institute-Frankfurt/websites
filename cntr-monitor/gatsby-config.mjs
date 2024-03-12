import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
import remarkGfm from 'remark-gfm'
import adapter from 'gatsby-adapter-netlify'

const config = {
  siteMetadata: {
    siteUrl: 'https://monitor.cntrarmscontrol.org/',
    title: 'CNTR Monitor',
    description: '',
    siteTwitter: '@PRIF_org',
    authorTwitter: '@PRIF_org',
    image: {
      src: '/social-image.png',
      alt: 'image alt',
    },
  },
  adapter: adapter.default(),
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
        icon: 'src/images/favicon.svg',
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
    {
      resolve: 'gatsby-plugin-local-search',
      options: {
        name: 'posts',
        engine: 'flexsearch',
        query: `
          {
            posts: allFile(filter: { sourceInstanceName: { eq: "content" }, extension: { eq: "mdx" } }) {
              nodes {
                id
                base
                relativeDirectory
                childMdx {
                  frontmatter {
                    title
                    tags
                    authors {
                      frontmatter {
                        name
                      }
                    }
                  }
                  fields {
                    slug
                    locale
                  }
                }
              }
            }
          }
        `,
        ref: 'id',
        index: ['title', 'authors', 'tags'],
        store: ['id', 'title', 'slug', 'authors', 'locale', 'relativeDirectory', 'postType', 'issue'],
        normalizer: ({ data }) => {
          const posts = data.posts.nodes.filter((el) => {
            return el.relativeDirectory.includes('/posts')
          })
          const pages = data.posts.nodes.filter((el) => {
            return el.relativeDirectory.includes('/pages')
          })
          const issues = data.posts.nodes.filter((el) => {
            return el.base === 'index.mdx'
          })

          const mergedData = [
            ...posts.map((node) => {
              const issue = issues.find((issueNode) => {
                return issueNode.relativeDirectory === node.relativeDirectory.replace('/posts', '')
              })
              const authors = node.childMdx.frontmatter.authors || []
              const tags = node.childMdx.frontmatter.tags || []
              return {
                id: node.id,
                slug: node.childMdx.fields.slug,
                title: node.childMdx.frontmatter.title,
                authors: authors.map((a) => a.frontmatter.name).join(';'),
                tags: tags.join(';'),
                relativeDirectory: node.relativeDirectory,
                locale: node.childMdx.fields.locale,
                issue: issue ? issue.childMdx.fields.slug : false,
                postType: 'post',
              }
            }),
            ...issues.map((node) => {
              return {
                id: node.id,
                slug: node.childMdx.fields.slug,
                locale: node.childMdx.fields.locale,
                title: node.childMdx.frontmatter.title,
                postType: 'issue',
              }
            }),
            ...pages.map((node) => {
              return {
                id: node.id,
                slug: node.childMdx.fields.slug,
                title: node.childMdx.frontmatter.title,
                locale: node.childMdx.fields.locale,
                postType: 'page',
              }
            }),
          ]
          return mergedData
        },
      },
    },
  ],
}

export default config
