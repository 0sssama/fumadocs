import { structure, type StructuredData } from '@/mdx-plugins/search-structure'
import FlexSearch from 'flexsearch'
import { NextResponse, type NextRequest } from 'next/server'
import type { SortedResult } from './shared'

type SearchAPI = {
  GET: (
    request: NextRequest
  ) => NextResponse<SortedResult[]> | Promise<NextResponse<SortedResult[]>>
}

type SimpleOptions = { indexes: Index[]; language?: string }

type AdvancedOptions = {
  indexes: AdvancedIndex[]
  /**
   * Enabled custom tags
   */
  tag?: boolean
  language?: string
}

type ToI18n<T extends { indexes: unknown }> = Omit<
  T,
  'indexes' | 'language'
> & {
  indexes: [language: string, indexes: T['indexes']][]
}

export function createSearchAPI<T extends 'simple' | 'advanced'>(
  type: T,
  _options: T extends 'simple' ? SimpleOptions : AdvancedOptions
): SearchAPI {
  if (type === 'simple') {
    return initSearchAPI(_options as SimpleOptions)
  }

  return initSearchAPIAdvanced(_options as AdvancedOptions)
}

export function createI18nSearchAPI<T extends 'simple' | 'advanced'>(
  type: T,
  options: ToI18n<T extends 'simple' ? SimpleOptions : AdvancedOptions>
): SearchAPI {
  const map = new Map<string, SearchAPI>()

  for (const [k, v] of options.indexes) {
    map.set(
      k,
      createSearchAPI(type, {
        ...options,
        language: k,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        indexes: v as any
      })
    )
  }

  return {
    GET(request) {
      const locale = request.nextUrl.searchParams.get('locale')

      if (locale && map.has(locale)) {
        return map.get(locale)!.GET(request)
      }

      return NextResponse.json([])
    }
  }
}

type Index = {
  title: string
  content: string
  url: string
  keywords?: string
}

export function initSearchAPI({ indexes, language }: SimpleOptions): SearchAPI {
  const store = ['title', 'url']
  const index = new FlexSearch.Document<Index, typeof store>({
    language,
    optimize: true,
    cache: 100,
    document: {
      id: 'url',
      store,
      index: [
        {
          field: 'title',
          tokenize: 'forward',
          resolution: 9
        },
        {
          field: 'content',
          tokenize: 'strict',
          context: {
            depth: 1,
            resolution: 9
          }
        },
        {
          field: 'keywords',
          tokenize: 'strict',
          resolution: 9
        }
      ]
    }
  })

  for (const page of indexes) {
    index.add({
      title: page.title,
      url: page.url,
      content: page.content,
      keywords: page.keywords
    })
  }

  return {
    GET(request) {
      const { searchParams } = request.nextUrl
      const query = searchParams.get('query')

      if (query == null) return NextResponse.json([])

      const results = index.search(query, 5, {
        enrich: true,
        suggest: true
      })

      const pages = results[0]?.result?.map<SortedResult>(page => ({
        type: 'page',
        content: page.doc.title,
        id: page.doc.url,
        url: page.doc.url
      }))

      return NextResponse.json(pages ?? [])
    }
  }
}

type AdvancedIndex = {
  id: string
  title: string
  content: string
  /**
   * Required if `tag` is enabled
   */
  tag?: string
  /**
   * preprocess mdx content with `structure`
   */
  structuredData?: StructuredData
  url: string
}

type InternalIndex = {
  id: string
  url: string
  page_id: string
  type: 'page' | 'heading' | 'text'
  tag?: string
  content: string
}

export function initSearchAPIAdvanced({
  indexes,
  language,
  tag = false
}: AdvancedOptions): SearchAPI {
  const store = ['id', 'url', 'content', 'page_id', 'type']
  const index = new FlexSearch.Document<InternalIndex, typeof store>({
    language,
    cache: 100,
    tokenize: 'forward',
    optimize: true,
    context: {
      depth: 2,
      bidirectional: true,
      resolution: 9
    },
    document: {
      id: 'id',
      tag: tag ? 'tag' : undefined,
      store,
      index: ['content']
    }
  })

  for (const page of indexes) {
    const data = page.structuredData ?? structure(page.content)
    let id = 0

    index.add({
      id: page.id,
      page_id: page.id,
      type: 'page',
      content: page.title,
      tag: page.tag,
      url: page.url
    })

    for (const heading of data.headings) {
      index.add({
        id: page.id + id++,
        page_id: page.id,
        type: 'heading',
        tag: page.tag,
        url: page.url + '#' + heading.id,
        content: heading.content
      })
    }

    for (const content of data.contents) {
      index.add({
        id: page.id + id++,
        page_id: page.id,
        tag: page.tag,
        type: 'text',
        url: content.heading ? page.url + '#' + content.heading : page.url,
        content: content.content
      })
    }
  }

  return {
    GET(request) {
      const query = request.nextUrl.searchParams.get('query')
      const tag = request.nextUrl.searchParams.get('tag')

      if (query == null) return NextResponse.json([])

      const results = index.search(query, 5, {
        enrich: true,
        tag: tag ?? undefined,
        limit: 6
      })[0]

      if (results == null) return NextResponse.json([])

      const map = new Map<string, SortedResult[]>()
      const sortedResult: SortedResult[] = []

      for (const item of results.result) {
        if (item.doc.type === 'page') {
          if (!map.has(item.doc.page_id)) {
            map.set(item.doc.page_id, [])
          }

          continue
        }

        const i: SortedResult = {
          id: item.doc.id,
          content: item.doc.content,
          type: item.doc.type,
          url: item.doc.url
        }

        if (map.has(item.doc.page_id)) {
          map.get(item.doc.page_id)?.push(i)
        } else {
          map.set(item.doc.page_id, [i])
        }
      }

      for (const [id, items] of map.entries()) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const page: InternalIndex = (index as any).get(id)

        if (!page) continue

        sortedResult.push({
          id: page.id,
          content: page.content,
          type: 'page',
          url: page.url
        })
        sortedResult.push(...items)
      }

      return NextResponse.json(sortedResult)
    }
  }
}
