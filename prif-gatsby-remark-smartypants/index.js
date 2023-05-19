import { retext } from 'retext'
import { visit } from 'unist-util-visit'
import smartypants from 'retext-smartypants'

console.log(`HIIIIII`)

const process = ({ markdownAST, markdownNode }, pluginOptions = {}) => {
  // TODO: Use this to apply different plugin options based on locale
  console.log(`Running smartypants on ${JSON.stringify(markdownNode.fields)}`)

  // We want to pass multiple sets of options for different locales
  if (!pluginOptions.locales) {
    pluginOptions = { locales: [pluginOptions] }
  }

  let options = pluginOptions.locales[0]

  if (markdownNode.fields.locale) {
    localIndex = pluginOptions.locales.findIndex((el) => el.locale === markdownNode.fields?.locale)
    if (localIndex !== -1) {
      console.log(`Found local settings for ${markdownNode.fields.locale}`)
      options = pluginOptions.locales[localIndex]
    }
  }

  visit(markdownAST, `text`, (node) => {
    const processedText = String(retext().use(smartypants, options).processSync(node.value))
    node.value = processedText
  })

  return markdownAST
}

export default process
