const { createFilePath } = require(`gatsby-source-filesystem`)
const slug = require('slug')
slug.extend({ '—': '-', '–': '-' })
const path = require('path')

const locales = ['en', 'de']
const defaultLocale = 'de'

function findTranslationNodes(n, nodes) {
  const locale = n.childMdx.fields.locale
  const nodeDir = n.relativeDirectory.replace(`${locale}/`, '')
  const translationTargets = locales.filter((el) => el !== locale)

  const translationCandidates = nodes.filter((el) => {
    const dir = el.relativeDirectory.replace(`${el.childMdx.fields.locale}/`, '')
    return dir === nodeDir
  })

  const rootFileName = n.base

  const translations = translationCandidates.filter((el) => {
    const foundIndex = translationTargets.findIndex((t) => {
      return rootFileName === el.base && el.childMdx.fields.locale !== locale
    })
    return foundIndex !== -1
  })

  return translations
}

exports.createPages = async function ({ actions, graphql }) {
  const { data } = await graphql(`
    query {
      posts: allFile(filter: { sourceInstanceName: { eq: "content" }, extension: { eq: "mdx" } }) {
        nodes {
          id
          base
          relativeDirectory
          childMdx {
            frontmatter {
              title
            }
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

  const posts = data.posts.nodes.filter((el) => {
    return el.relativeDirectory.includes('/posts')
  })
  const pages = data.posts.nodes.filter((el) => {
    return el.relativeDirectory.includes('/pages')
  })
  const reports = data.posts.nodes.filter((el) => {
    return el.base === 'index.mdx'
  })

  console.log(`${reports.length} reports found`)
  console.log(`${posts.length} posts found`)
  console.log(`${pages.length} pages found`)

  // Create report pages
  reports.forEach((node) => {
    const locale = node.childMdx.fields.locale
    const postTemplate = require.resolve(`./src/components/Report.js`)
    const translations = findTranslationNodes(node, reports)
    const translationIds = translations.map((t) => t.id)
    const year = node.relativeDirectory.replace(/(.{2})\/(reports)\//g, '')
    let path = `${locale && locale !== defaultLocale ? locale : ''}/${year}/`

    actions.createPage({
      path: path,
      component: `${postTemplate}?__contentFilePath=${node.childMdx.internal.contentFilePath}`,
      context: { id: node.id, postsDirectory: `${node.relativeDirectory}/posts`, translations: translationIds },
    })
  })

  //  Create post pages
  posts.forEach((post) => {
    const locale = post.childMdx.fields.locale
    const postTemplate = require.resolve(`./src/components/Post.js`)
    const translations = findTranslationNodes(post, posts)
    const translationIds = translations.map((t) => t.id)
    const year = post.relativeDirectory.replace(/(.{2})\/(reports)\//g, '').replace('/posts', '')
    let path = `${locale && locale !== defaultLocale ? locale : ''}/${year}/${post.childMdx.fields.slug}`

    const report = reports.find((report) => {
      return report.relativeDirectory === post.relativeDirectory.replace('/posts', '')
    })

    if (report) {
      console.log(`Creating ${post.childMdx.frontmatter.title} (${report.childMdx.frontmatter.title})`)
    }

    actions.createPage({
      path: path,
      component: `${postTemplate}?__contentFilePath=${post.childMdx.internal.contentFilePath}`,
      context: { id: post.id, translations: translationIds, reportId: report.id },
    })
  })

  pages.forEach((node) => {
    const locale = node.childMdx.fields.locale
    const postTemplate = require.resolve(`./src/components/Page.js`)
    const translations = findTranslationNodes(node, pages)
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
  // Create auuthor nodes
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
      if (node.internal.contentFilePath.indexOf(`/${locale}/`) !== -1) {
        nodeLocale = locale
      }
    })
    console.log(`Setting locale: ${nodeLocale}`)
    actions.createNodeField({ node, name: 'locale', value: nodeLocale })

    let path = createFilePath({ node, getNode })
    if (node.frontmatter.title) path = slug(node.frontmatter.title)
    actions.createNodeField({ node, name: 'slug', value: path })
  }
}

exports.createSchemaCustomization = async ({ getNode, getNodesByType, pathPrefix, reporter, cache, actions, schema }) => {
  const { createTypes } = actions

  const typeDefs = `
  type Author implements Node {
    author_id: String
    name: String
  }
  type PostFrontmatter {
    authors: [Author] @link(by: "author_id")
    intro: String
    teaser: String
    hero_image: String
    hero_alt: String
    hero_credit: String
    eyebrow: String
    title: String
    color: String
    color_secondary: String
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
