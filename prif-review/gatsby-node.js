const { createFilePath } = require(`gatsby-source-filesystem`)
const slug = require('slug')
const path = require('path')
slug.extend({ '—': '-', '–': '-' })

exports.createPages = async function ({ actions, graphql }) {
  const { data } = await graphql(`
    query {
      posts: allFile(filter: { sourceInstanceName: { eq: "posts" }, extension: { eq: "mdx" } }) {
        nodes {
          id
          childMdx {
            fields {
              slug
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
          childMdx {
            fields {
              slug
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
    const path = node.childMdx.fields.slug
    actions.createPage({
      path: path,
      component: `${postTemplate}?__contentFilePath=${node.childMdx.internal.contentFilePath}`,
      context: { id: node.id },
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
    let path = createFilePath({ node, getNode })
    if (node.frontmatter.title) {
      path = slug(node.frontmatter.title)
    }
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
    image: File @fileByRelativePath
  }
  type FrontMatter {
    hero_image: File @fileByRelativePath
    authors: [Author] @link(by: "author_id")
  }
  type Mdx {
    frontmatter: FrontMatter
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
