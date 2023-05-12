const { createFilePath } = require(`gatsby-source-filesystem`)
const slug = require('slug')
slug.extend({ '—': '-', '–': '-' })
const path = require('path')

const locales = ['en', 'de']
const defaultLocale = 'de'

function findTranslationNodes(n, nodes) {
  const locale = n.childMdx.fields.locale
  const translationCandidates = locales.filter((el) => el !== locale)

  console.log(`Searching translations for ${n.childMdx.fields.slug}, candidates: ${translationCandidates.join(', ')}`)

  const rootFileName = n.base.replace(`.${locale}.mdx`, '')

  const translations = nodes.filter((el) => {
    const foundIndex = translationCandidates.findIndex((t) => {
      const candidateFileName = el.base.replace(`.${t}.mdx`, '')
      console.log(`${rootFileName} VS ${candidateFileName}`)
      return rootFileName === candidateFileName
    })
    return foundIndex !== -1
  })

  console.log(`Translations found: ${translations.map((t) => `${t.childMdx.fields.slug} (${t.childMdx.fields.locale})`).join(', ')}`)

  return translations
}

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
    const locale = node.childMdx.fields.locale
    const postTemplate = require.resolve(`./src/components/Post.js`)
    const translations = findTranslationNodes(node, data.posts.nodes)
    const translationIds = translations.map((t) => t.id)
    let path = `${locale && locale !== defaultLocale ? locale : ''}/${node.childMdx.fields.slug}`

    actions.createPage({
      path: path,
      component: `${postTemplate}?__contentFilePath=${node.childMdx.internal.contentFilePath}`,
      context: { id: node.id, translations: translationIds },
    })
  })

  data.pages.nodes.forEach((node) => {
    const locale = node.childMdx.fields.locale
    const postTemplate = require.resolve(`./src/components/Page.js`)
    const translations = findTranslationNodes(node, data.pages.nodes)
    const translationIds = translations.map((t) => t.id)
    let path = `${locale && locale !== defaultLocale ? locale : ''}/${node.childMdx.fields.slug}`
    actions.createPage({
      path: path,
      component: `${postTemplate}?__contentFilePath=${node.childMdx.internal.contentFilePath}`,
      context: { id: node.id, translations: translationIds },
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