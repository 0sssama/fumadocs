import { Pre } from '@/components/pre'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { getTree } from '@/utils/page-tree'
import { allDocs } from 'contentlayer/generated'
import type { Metadata } from 'next'
import { getMDXComponent } from 'next-contentlayer/hooks'
import { RollButton } from 'next-docs-ui/components'
import {
  Card,
  Cards,
  Heading,
  Image,
  Link,
  MDXContent,
  Table
} from 'next-docs-ui/mdx'
import { DocsPage } from 'next-docs-ui/page'
import { getPageUrl } from 'next-docs-zeta/contentlayer'
import { findNeighbour, getTableOfContents } from 'next-docs-zeta/server'
import { notFound } from 'next/navigation'

type Param = {
  mode: string
  slug?: string[]
}
export default async function Page({ params }: { params: Param }) {
  const tree = getTree(params.mode)
  const path = [params.mode, ...(params.slug ?? [])].join('/')
  const page = allDocs.find(page => page.slug === path)

  if (page == null) {
    notFound()
  }

  const toc = await getTableOfContents(page.body.raw)
  const MDX = getMDXComponent(page.body.code)
  const url = getPageUrl(page.slug.split('/'), '/docs')
  const neighbours = findNeighbour(tree, url)

  return (
    <DocsPage
      toc={toc}
      footer={neighbours}
      tocContent={
        <div className="mt-4 border-t pt-4">
          <a
            href={`https://github.com/SonMooSans/next-docs/blob/main/apps/docs/content/${page._raw.sourceFilePath}`}
            target="_blank"
            rel="noreferrer noopener"
            className="text-muted-foreground hover:text-foreground text-xs font-medium"
          >
            Edit this Page -&gt;
          </a>
        </div>
      }
    >
      <MDXContent>
        <div className="nd-not-prose mb-12">
          <h1 className="text-foreground mb-4 text-3xl font-bold sm:text-4xl">
            {page.title}
          </h1>
          <p className="text-muted-foreground sm:text-lg">{page.description}</p>
        </div>
        <MDX
          components={{
            Card: props => <Card {...props} />,
            Cards: props => <Cards {...props} />,
            a: props => <Link {...props} />,
            pre: props => <Pre {...props} />,
            img: props => <Image {...props} />,
            h1: props => <Heading as="h1" {...props} />,
            h2: props => <Heading as="h2" {...props} />,
            h3: props => <Heading as="h3" {...props} />,
            h4: props => <Heading as="h4" {...props} />,
            h5: props => <Heading as="h5" {...props} />,
            h6: props => <Heading as="h6" {...props} />,
            table: props => <Table {...props} />,
            Accordion: props => <Accordion {...props} />,
            AccordionTrigger: props => <AccordionTrigger {...props} />,
            AccordionItem: props => <AccordionItem {...props} />,
            AccordionContent: props => <AccordionContent {...props} />,
            blockquote: props => (
              <div className="my-4 rounded-lg border px-3 text-sm shadow-md">
                {props.children}
              </div>
            ),
            RollButton: props => <RollButton {...props} />
          }}
        />
      </MDXContent>
    </DocsPage>
  )
}

export function generateMetadata({ params }: { params: Param }): Metadata {
  const path = [params.mode, ...(params.slug ?? [])].join('/')
  const page = allDocs.find(page => page.slug === path)

  if (page == null) return {}

  const description =
    page.description ??
    'The headless ui library for building documentation websites'

  return {
    title: page.title,
    description,
    openGraph: {
      url: 'https://next-docs-zeta.vercel.app',
      title: page.title,
      description,
      images: '/banner.png',
      siteName: 'Next Docs'
    },
    twitter: {
      card: 'summary_large_image',
      creator: '@money_is_shark',
      title: page.title,
      description,
      images: '/banner.png'
    }
  }
}

export function generateStaticParams() {
  return allDocs.map(docs => {
    const [mode, ...slugs] = docs.slug.split('/')

    return {
      slug: slugs,
      mode
    }
  })
}
