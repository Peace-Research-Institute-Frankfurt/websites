const path = require('path')
const { createFilePath } = require(`gatsby-source-filesystem`)
const slug = require('slug')

slug.extend({ '—': '-', '–': '-' })

const locales = ['en', 'fr']
const defaultLocale = 'en'

function findTranslationNodes(n, nodes) {
  if (!n.childMdx?.fields?.locale) return []

  const locale = n.childMdx.fields.locale
  const translationTargets = locales.filter((el) => el !== locale)

  const translationCandidates = nodes.filter((el) => {
    if (!el.childMdx?.fields?.locale) return false
    return el.relativeDirectory === n.relativeDirectory
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
      chapters: allFile(filter: { extension: { eq: "mdx" }, name: { nin: ["index", "__print"] }, sourceInstanceName: { eq: "luContent" } }) {
        nodes {
          id
          base
          relativeDirectory
          childMdx {
            fields {
              slug
              locale
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
          base
          relativeDirectory
          childMdx {
            fields {
              locale
            }
            internal {
              contentFilePath
            }
          }
        }
      }
      printUnits: allFile(filter: { extension: { eq: "mdx" }, name: { eq: "__print" }, sourceInstanceName: { eq: "luContent" } }) {
        nodes {
          id
          base
          relativeDirectory
          childMdx {
            fields {
              locale
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
          relativeDirectory
          childMdx {
            fields {
              slug
              locale
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
    if (!node.childMdx?.fields?.locale) return
    const chapterSlug = node.childMdx.fields.slug
    const locale = node.childMdx.fields.locale
    const lu_id = node.relativeDirectory
    const localePath = locale !== defaultLocale ? `${locale}/` : ''
    const translations = findTranslationNodes(node, data.chapters.nodes)
    const translationIds = translations.map((t) => t.id)
    const template = require.resolve(`./src/components/Chapter.js`)
    actions.createPage({
      path: `${localePath}${lu_id}/${chapterSlug}`,
      component: `${template}?__contentFilePath=${node.childMdx.internal.contentFilePath}`,
      context: { id: node.id, lu_id, language: locale, translations: translationIds },
    })
  })

  data.units.nodes.forEach((node) => {
    if (!node.childMdx?.fields?.locale) return
    const locale = node.childMdx.fields.locale
    const lu_id = node.relativeDirectory
    const localePath = locale !== defaultLocale ? `${locale}/` : ''
    const translations = findTranslationNodes(node, data.units.nodes)
    const translationIds = translations.map((t) => t.id)
    const template = require.resolve(`./src/components/LearningUnit.js`)
    actions.createPage({
      path: `${localePath}${lu_id}`,
      component: `${template}?__contentFilePath=${node.childMdx.internal.contentFilePath}`,
      context: { id: node.id, lu_id, language: locale, translations: translationIds },
    })
  })

  data.printUnits.nodes.forEach((node) => {
    if (!node.childMdx?.fields?.locale) return
    const locale = node.childMdx.fields.locale
    const lu_id = node.relativeDirectory
    const localePath = locale !== defaultLocale ? `${locale}/` : ''
    const translations = findTranslationNodes(node, data.printUnits.nodes)
    const translationIds = translations.map((t) => t.id)
    const template = require.resolve(`./src/components/LearningUnitPrint.js`)
    actions.createPage({
      path: `${localePath}${lu_id}/print`,
      component: `${template}?__contentFilePath=${node.childMdx.internal.contentFilePath}`,
      context: { id: node.id, lu_id, language: locale, translations: translationIds },
    })
  })

  data.pages.nodes.forEach((node) => {
    if (!node.childMdx?.fields?.slug) return
    const locale = node.childMdx?.fields?.locale || defaultLocale
    const localePath = locale !== defaultLocale ? `${locale}/` : ''
    const rawSlug = node.childMdx.fields.slug.replace(/^\/(fr|en)\//, '/')
    const translations = findTranslationNodes(node, data.pages.nodes)
    const translationIds = translations.map((t) => t.id)
    const template = require.resolve(`./src/components/Page.js`)
    actions.createPage({
      path: `${localePath}${rawSlug}`,
      component: `${template}?__contentFilePath=${node.childMdx.internal.contentFilePath}`,
      context: { id: node.id, language: locale, translations: translationIds },
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
    let nodeLocale = defaultLocale
    locales.forEach((locale) => {
      if (node.internal.contentFilePath.indexOf(`/${locale}/`) !== -1) {
        nodeLocale = locale
      }
    })
    actions.createNodeField({ node, name: 'locale', value: nodeLocale })

    let nodePath = createFilePath({ node, getNode })
    if (node.frontmatter.title && node.internal.contentFilePath.indexOf('index.mdx') === -1) {
      nodePath = slug(node.frontmatter.title)
    }
    actions.createNodeField({ node, name: 'slug', value: nodePath })
  }
}

exports.createSchemaCustomization = async ({ actions }) => {
  const { createTypes } = actions
  const typeDefs = `
  type UpdateEntry {
    date: String
    description: String
  }
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
    updates: [UpdateEntry]
  }
  type Mdx {
    frontmatter: FrontMatter
  }
  type MdxFields {
    slug: String
    locale: String
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
    '@data': path.resolve(__dirname, 'content/data'),
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
    {
      test: /\.csv$/,
      loader: 'csv-loader',
      options: {
        dynamicTyping: true,
        header: true,
        skipEmptyLines: true,
      },
    },
  ]
  actions.replaceWebpackConfig(cfg)
}
