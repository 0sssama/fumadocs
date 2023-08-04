/**
 * Default configuration generator
 *
 * Feel free to copy and modify the code
 *
 * Warning: Shouldn't be imported in Next.js, this can cause problem. Put it in contentlayer.config.ts only
 */

import { rehypeImgSize, rehypeNextDocs, remarkGfm } from '@/mdx-plugins'
import type { Args } from 'contentlayer/source-files'
import { defineDocumentType } from 'contentlayer/source-files'
import type { Options as ImgSizeOptions } from 'rehype-img-size'

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
      },
      icon: {
        type: 'string',
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
      },
      icon: {
        type: 'string',
        required: false
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
        rehypeNextDocs,
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

export const defaultConfig: Args = createConfig()
