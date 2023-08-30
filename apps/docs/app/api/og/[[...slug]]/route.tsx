import { allDocs } from '@/.contentlayer/generated'
import { getPage } from '@/utils/source'
import { ImageResponse, NextResponse, type NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug?: string[] } }
) {
  const page = getPage(params.slug)
  if (!page) return NextResponse.json('Not Found', { status: 404 })

  const font = await fetch(new URL('/inter.ttf', request.url))
  const title =
    params?.slug?.[0] === 'ui' ? 'Next Docs UI' : 'Next Docs Headless'

  return new ImageResponse(
    (
      <div
        tw="flex flex-col w-full h-full p-12"
        style={{
          background: 'linear-gradient(to bottom, black, rgb(20,20,60))'
        }}
      >
        <div tw="flex flex-row items-center mb-12">
          <svg
            width="50"
            height="50"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgb(165 243 252)"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <line x1="3" x2="21" y1="9" y2="9" />
            <line x1="9" x2="9" y1="21" y2="9" />
          </svg>
          <p
            tw="text-transparent font-bold text-4xl ml-4"
            style={{
              backgroundClip: 'text',
              background:
                'linear-gradient(to right, white, rgba(255,255,255,0.7))'
            }}
          >
            {title}
          </p>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={new URL('/gradient.png', request.url).toString()}
          tw="absolute inset-0"
        />
        <div
          tw="flex flex-col p-10 border border-gray-400/30 rounded-3xl mt-auto"
          style={{
            background:
              'linear-gradient(to top, rgba(255,255,255,0.1), transparent)'
          }}
        >
          <p tw="text-white font-bold text-6xl">{page.title}</p>
          <p tw="text-white/70 font-medium text-3xl">
            The Documentation Framework
          </p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [{ name: 'Inter', data: await font.arrayBuffer(), weight: 500 }]
    }
  )
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
