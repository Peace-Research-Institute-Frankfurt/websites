import { retext } from 'retext'
import { visit } from 'unist-util-visit'
import smartypants from 'retext-smartypants'

const process = ({ markdownAST }, pluginOptions = {}) => {
  visit(markdownAST, `text`, (node) => {
    const processedText = String(retext().use(smartypants, pluginOptions).processSync(node.value))
    node.value = processedText
  })

  return markdownAST
}

export default process
