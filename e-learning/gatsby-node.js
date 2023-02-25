const path = require('path')
const { createFilePath } = require(`gatsby-source-filesystem`)
const slug = require('slug')
slug.extend({ '—': '-', '–': '-' })

exports.createPages = async function ({ actions, graphql }) {
  const { data } = await graphql(`
    query {
      chapters: allFile(filter: { extension: { eq: "mdx" }, name: { ne: "index" }, sourceInstanceName: { eq: "luContent" } }) {
        nodes {
          id
          relativeDirectory
          childMdx {
            fields {
              slug
            }
            internal {
              contentFilePath
            }
          }
        }
      }
      units: allFile(filter: { extension: { eq: "mdx" }, name: { eq: "index" }, sourceInstanceName: { eq: "luContent" } }) {
        nodes {
          id
          relativeDirectory
          childMdx {
            fields {
              slug
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
            internal {
              contentFilePath
            }
          }
        }
      }
    }
  `)

  data.chapters.nodes.forEach((node) => {
    const slug = node.childMdx.fields.slug
    const lu_id = node.relativeDirectory
    const id = node.id
    const template = require.resolve(`./src/components/Chapter.js`)
    actions.createPage({
      path: `${lu_id}/${slug}`,
      component: `${template}?__contentFilePath=${node.childMdx.internal.contentFilePath}`,
      context: { id: id, lu_id: lu_id },
    })
  })

  data.units.nodes.forEach((node) => {
    const id = node.id
    const lu_id = node.relativeDirectory
    actions.createPage({
      path: lu_id,
      component: require.resolve(`./src/components/LearningUnit.js`),
      context: { id: id, lu_id: lu_id },
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
    if (node.frontmatter.title && node.internal.contentFilePath.indexOf('index.mdx') === -1) {
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
  type CountriesJsonName implements Node {
    common: String
    official: String
    article: String
  }
  type CountriesJson implements Node {
    alpha3: String!
    article: Boolean
    name: CountriesJsonName
  }
  type InstitutionsJson implements Node {
    members: [CountriesJson] @link(by: "alpha3")
  }
  type TreatyParticipant {
    country: CountriesJson @link(by: "alpha3")
  }
  type TreatiesJson implements Node {
    participants: [TreatyParticipant]
  }
  type Author implements Node {
    author_id: String
    image: File
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

exports.onCreateWebpackConfig = ({ rules, actions, getConfig }) => {
  const cfg = getConfig()
  const imgsRule = rules.images()

  cfg.resolve.alias = {
    ...cfg.resolve.alias,
    '@shared': path.resolve(__dirname, '../shared'),
  }

  // The following code:
  // - adds the react-svg-loader to our webpack config so we can use inline SVG in React components
  // - removes the default URL loader, then re-adds two copies of it (once set to ignore SVGs),
  //   and once to include SVGs, but only when they're imported in CSS files

  cfg.module.rules = [
    ...cfg.module.rules.filter((rule) => {
      if (rule.test) {
        return rule.test.toString() !== imgsRule.test.toString()
      }
      return true
    }),
    {
      test: /\.svg$/,
      issuer: { not: /\.(css|scss|sass)$/ },
      use: { loader: `svg-react-loader`, options: {} },
    },
    { ...imgsRule, test: new RegExp(imgsRule.test.toString().replace('svg|', '').slice(1, -1)) },
    { ...imgsRule, issuer: /\.(css|scss|sass)$/ },
  ]

  actions.replaceWebpackConfig(cfg)
}
