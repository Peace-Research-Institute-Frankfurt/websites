const { createFilePath } = require(`gatsby-source-filesystem`)
const slug = require('slug')
slug.extend({ '—': '-', '–': '-' })
const path = require('path')

const locales = ['en', 'de']
const defaultLocale = 'de'

exports.createPages = async function ({ actions, graphql }) {
  const { data } = await graphql(`
    query {
      posts: allFile(filter: { sourceInstanceName: { eq: "posts" }, extension: { eq: "mdx" } }) {
        nodes {
          id
          base
          childMdx {
            fields {
              slug
              locale
            }
            frontmatter {
              title
            }
            internal {
              contentFilePath
            }
          }
        }
      }
      pages: allFile(filter: { sourceInstanceName: { eq: "pages" }, extension: { eq: "mdx" } }) {
        nodes {
          id
          base
          childMdx {
            fields {
              slug
              locale
            }
            frontmatter {
              title
            }
            internal {
              contentFilePath
            }
          }
        }
      }
    }
  `)

  data.posts.nodes.forEach((node) => {
    const postTemplate = require.resolve(`./src/components/Post.js`)
    const locale = node.childMdx.fields.locale
    const translationCandidates = locales.filter((el) => el !== locale)
    let path = `${locale && locale !== defaultLocale ? locale : ''}/${node.childMdx.fields.slug}`

    console.log(`Creating post at ${path}`)
    console.log(`Translation candidates: ${translationCandidates.join(', ')}`)

    const rootFileName = node.base.replace(`.${locale}.mdx`, '')
    console.log(`Root filename: ${rootFileName}`)

    const translations = data.posts.nodes.filter((el) => {
      const foundIndex = translationCandidates.findIndex((t) => {
        const candidateFileName = el.base.replace(`.${t}.mdx`, '')
        return candidateFileName === rootFileName
      })
      return foundIndex !== -1
    })

    const translationIds = translations.map((t) => t.id)

    console.log(`Translations found: ${translations.map((t) => t.childMdx.frontmatter.title).join(', ')}`)
    actions.createPage({
      path: path,
      component: `${postTemplate}?__contentFilePath=${node.childMdx.internal.contentFilePath}`,
      context: { id: node.id, translations: translationIds },
    })
  })

  data.pages.nodes.forEach((node) => {
    const postTemplate = require.resolve(`./src/components/Page.js`)
    const path = node.childMdx.fields.slug
    actions.createPage({
      path: path,
      component: `${postTemplate}?__contentFilePath=${node.childMdx.internal.contentFilePath}`,
      context: { id: node.id },
    })
  })
}

exports.onCreateNode = ({ node, actions, createNodeId, getNode }) => {
  if (node.internal.type === 'Mdx' && node.internal.contentFilePath.indexOf('authors') !== -1) {
    actions.createNode({
      id: createNodeId(`author-${node.id}`),
      parent: node.id,
      author_id: node.frontmatter.author_id,
      frontmatter: node.frontmatter,
      internal: {
        type: `Author`,
        contentDigest: node.internal.contentDigest,
      },
    })
  }
  if (node.internal.type === 'Mdx') {
    let nodeLocale = ''
    locales.forEach((locale) => {
      if (node.internal.contentFilePath.indexOf(`.${locale}.mdx`) !== -1) {
        console.log(`Writing locale: ${locale}`)
        nodeLocale = locale
      }
    })

    let path = createFilePath({ node, getNode })
    if (node.frontmatter.title) {
      path = slug(node.frontmatter.title)
    }

    actions.createNodeField({
      node,
      name: 'locale',
      value: nodeLocale,
    })

    actions.createNodeField({
      node,
      name: 'slug',
      value: path,
    })
  }
}

exports.createSchemaCustomization = async ({ getNode, getNodesByType, pathPrefix, reporter, cache, actions, schema }) => {
  const { createTypes } = actions

  const typeDefs = `
  type Author implements Node {
    author_id: String
  }
  type PostFrontmatter {
    authors: [Author] @link(by: "author_id")
    intro: String
  }
  type Mdx {
    frontmatter: PostFrontmatter
  }
  `
  createTypes(typeDefs)
}

exports.onCreateWebpackConfig = ({ actions, getConfig }) => {
  const cfg = getConfig()
  cfg.resolve.alias = {
    ...cfg.resolve.alias,
    '@shared': path.resolve(__dirname, '../shared'),
  }
  actions.replaceWebpackConfig(cfg)
}
