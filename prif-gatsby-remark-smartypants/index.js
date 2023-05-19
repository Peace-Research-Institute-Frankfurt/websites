import { retext } from 'retext'
import { visit } from 'unist-util-visit'
import smartypants from 'retext-smartypants'

const process = ({ markdownAST, markdownNode }, pluginOptions = {}) => {
  if (!pluginOptions.locales) pluginOptions = { locales: [pluginOptions] }
  let options = pluginOptions.locales[0]

  if (markdownNode.fields.locale) {
    const localeIndex = pluginOptions.locales.findIndex((el) => el.locale === markdownNode.fields?.locale)
    if (localeIndex !== -1) options = pluginOptions.locales[localeIndex]
  }

  visit(markdownAST, `text`, (node) => {
    const processedText = String(retext().use(smartypants, options).processSync(node.value))
    node.value = processedText
  })
  return markdownAST
}

export default process
