import type { Args } from 'contentlayer/source-files'
import { defineDocumentType } from 'contentlayer/source-files'
import type { Options as ImgSizeOptions } from 'rehype-img-size'
import rehypeImgSize from 'rehype-img-size'
import type { Options as CodeOptions } from 'rehype-pretty-code'
import rehypePrettycode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import {
  rehypeCodeBlocksPostProcess,
  rehypeCodeBlocksPreProcess
} from './mdx-plugins'

function removeSlash(path: string) {
  let start = 0,
    end = path.length
  while (path.charAt(start) == '/') start++
  while (path.charAt(end - 1) == '/' && end > start) end--

  return path.slice(start, end)
}

function removePattern(path: string, pattern: string) {
  if (path.endsWith('/index') || path === 'index') {
    path = path.slice(0, path.length - 'index'.length)
  }

  if (!path.startsWith(pattern)) {
    return path
  }

  return removeSlash(path.slice(pattern.length))
}

type Options = {
  /**
   * Where the docs files located
   * @default "docs"
   */
  docsPattern: string

  /**
   * @default "content"
   */
  contentDirPath: string

  /**
   * The directory path for images
   * @default "./public"
   */
  imgDirPath: string
}

export function createConfig(options: Partial<Options> = {}): Args {
  const {
    docsPattern = 'docs',
    contentDirPath = 'content',
    imgDirPath = './public'
  } = options

  const Docs = defineDocumentType(() => ({
    name: 'Docs',
    filePathPattern: `${docsPattern}/**/*.mdx`,
    contentType: 'mdx',
    fields: {
      title: {
        type: 'string',
        description: 'The title of the document',
        required: true
      },
      description: {
        type: 'string',
        description: 'The description of the document',
        required: false
      }
    },
    computedFields: {
      locale: {
        type: 'string',
        resolve: post => {
          return post._raw.flattenedPath.split('.')[1]
        }
      },
      slug: {
        type: 'string',
        resolve: post => {
          return removePattern(
            post._raw.flattenedPath.split('.')[0],
            docsPattern
          )
        }
      }
    }
  }))

  const Meta = defineDocumentType(() => ({
    name: 'Meta',
    filePathPattern: `${docsPattern}/**/*.json`,
    contentType: 'data',
    fields: {
      title: {
        type: 'string',
        description: 'The title of the folder',
        required: false
      },
      pages: {
        type: 'list',
        of: {
          type: 'string'
        },
        description: 'Pages of the folder',
        default: []
      }
    },
    computedFields: {
      slug: {
        type: 'string',
        resolve: post => removePattern(post._raw.sourceFileDir, docsPattern)
      }
    }
  }))

  return {
    contentDirPath,
    documentTypes: [Docs, Meta],
    mdx: {
      rehypePlugins: [
        rehypeCodeBlocksPreProcess,
        [rehypePrettycode, codeOptions],
        rehypeCodeBlocksPostProcess,
        rehypeSlug,
        [
          /* eslint-disable */
          rehypeImgSize as any,
          {
            dir: imgDirPath
          } as ImgSizeOptions
        ]
      ],
      remarkPlugins: [remarkGfm]
    }
  }
}

/**
 * MDX Plugins
 */
export const mdxPlugins = {
  rehypeCodeBlocksPreProcess,
  rehypePrettycode,
  rehypeCodeBlocksPostProcess,
  rehypeSlug,
  rehypeImgSize: rehypeImgSize as any, // fix tsc errors
  remarkGfm
}

export const codeOptions: Partial<CodeOptions> = {
  theme: 'css-variables',
  keepBackground: false,
  onVisitLine(node) {
    if (node.children.length === 0) {
      node.children = [{ type: 'text', value: ' ' }]
    }
  },
  onVisitHighlightedLine(node) {
    node.properties.className.push('line-highlighted')
  },
  onVisitHighlightedWord(node) {
    node.properties.className = ['word-highlighted']
  }
}

export const defaultConfig: Args = createConfig()
