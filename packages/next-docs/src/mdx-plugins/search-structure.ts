// @ts-nocheck
import Slugger from 'github-slugger'
import type { Node, Root } from 'mdast'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkMdx from 'remark-mdx'
import type { PluggableList, Transformer } from 'unified'
import { visit } from 'unist-util-visit'

type Heading = {
  id: string
  content: string
}

type Content = {
  heading: string | undefined
  content: string
}

export type StructuredData = {
  headings: Heading[]
  /**
   * Refer to paragraphs, a heading may contains multiple contents as well
   */
  contents: Content[]
}

type Options = {
  /**
   * Types to be scanned
   *
   * @default ["heading", "blockquote", "paragraph"]
   */
  types?: string[]
}

const slugger = new Slugger()
const textTypes = ['text', 'inlineCode']

function flattenNode(node: Node) {
  const p: string[] = []
  visit(node, textTypes, node => {
    if (typeof node.value !== 'string') return
    p.push(node.value)
  })
  return p.join(``)
}

function structurize({
  types = ['paragraph', 'blockquote', 'heading']
}: Options = {}): Transformer<Root, Root> {
  return (node, file) => {
    slugger.reset()
    const data: StructuredData = { contents: [], headings: [] }
    let lastHeading: string | undefined = ''

    visit(node, types, element => {
      if (element.type === 'heading') {
        const heading = flattenNode(element)
        const slug = slugger.slug(heading)

        data.headings.push({
          id: slug,
          content: heading
        })

        lastHeading = slug
        return 'skip'
      }

      data.contents.push({
        heading: lastHeading,
        content: flattenNode(element)
      })

      return 'skip'
    })

    file.data = data
  }
}

/**
 * Extract data from markdown/mdx content
 */
export function structure(
  content: string,
  remarkPlugins: PluggableList = [],
  options: Options = {}
): StructuredData {
  const result = remark()
    .use(remarkGfm)
    .use(remarkMdx)
    .use(remarkPlugins)
    .use([structurize, options])
    .processSync(content)

  return result.data
}
