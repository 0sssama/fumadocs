import { readFile } from 'fs/promises'
import path from 'path'
import { allDocs } from '@/.contentlayer/generated'
import { base_url } from '@/utils/metadata'
import { getPage } from '@/utils/source'
import clsx from 'clsx'
import { ImageResponse, NextResponse, type NextRequest } from 'next/server'

const medium = readFile(path.resolve('./public/inter-medium.woff'))
const bold = readFile(path.resolve('./public/inter-bold.woff'))

export async function GET(
  _: NextRequest,
  { params }: { params: { slug?: string[] } }
) {
  const page = getPage(params.slug)
  if (!page) return NextResponse.json('Not Found', { status: 404 })
  const isUI = params?.slug?.[0] === 'ui'

  return new ImageResponse(
    (
      <div
        tw="flex flex-col w-full h-full p-14"
        style={{
          background: 'linear-gradient(to top, rgb(5,5,30), rgb(20,20,60))'
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={new URL('/gradient.png', base_url).toString()}
          tw="absolute top-0 right-0"
        />
        <div tw="flex flex-row items-center mb-12">
          <div
            tw={clsx(
              'flex p-3 border-2 rounded-xl shadow-xl ',
              isUI
                ? 'shadow-blue-600 border-blue-400'
                : 'shadow-purple-600 border-purple-400'
            )}
            style={{
              background: `linear-gradient(to bottom, black, ${
                isUI ? 'rgb(0,50,150)' : 'rgb(150,50,150)'
              })`
            }}
          >
            {isUI ? (
              <svg
                width="44"
                height="44"
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
            ) : (
              <svg
                width="44"
                height="44"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgb(233 213 255)"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="m16 6 4 14" />
                <path d="M12 6v14" />
                <path d="M8 8v12" />
                <path d="M4 4v16" />
              </svg>
            )}
          </div>

          <p tw="text-gray-200 font-bold ml-6 text-4xl">
            {isUI ? 'Next Docs UI' : 'Next Docs Zeta'}
          </p>
        </div>
        <div
          tw="flex flex-col p-10 border border-gray-400/30 rounded-3xl mt-auto"
          style={{
            background:
              'linear-gradient(to top, rgba(255,255,255,0.1), rgba(255,255,255,0.02))'
          }}
        >
          <p tw="text-white font-bold text-6xl">{page.title}</p>
          <p tw="text-gray-300 font-medium text-3xl">
            {page.description ?? 'The Documentation Framework'}
          </p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Inter', data: await medium, weight: 500 },
        { name: 'Inter', data: await bold, weight: 700 }
      ]
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
