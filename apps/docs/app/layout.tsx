import { Nav } from '@/components/nav'
import { ExternalLinkIcon, Star } from 'lucide-react'
import { Inter } from 'next/font/google'
import 'next-docs-ui/style.css'
import 'katex/dist/katex.min.css'
import './style.css'
import { base_url, createMetadata } from '@/utils/metadata'
import { Provider } from './provider'

export const metadata = createMetadata({
  title: {
    template: '%s | Next Docs',
    default: 'Next Docs'
  },
  themeColor: '#030711',
  description: 'The Next.js framework for building documentation sites',
  metadataBase: base_url
})

const inter = Inter({
  subsets: ['latin']
})

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <Provider>
          <Nav />
          {children}
          <Footer />
        </Provider>
      </body>
    </html>
  )
}

function Footer() {
  return (
    <footer className="bg-card text-secondary-foreground mt-auto border-t py-12">
      <div className="container flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-sm font-semibold">NEXT DOCS</p>
          <p className="text-xs">
            Built with ❤️ by{' '}
            <a
              href="https://fuma-dev.vercel.app"
              rel="noreferrer noopener"
              target="_blank"
              className="font-medium"
            >
              Fuma
            </a>
          </p>
        </div>

        <div className="flex flex-row items-center gap-20">
          <a
            href="https://github.com/fuma-nama/next-docs"
            rel="noreferrer noopener"
            className="flex flex-row items-center text-sm text-muted-foreground transition-colors hover:text-accent-foreground"
          >
            <Star className="mr-2 h-4 w-4" />
            Give us a star
          </a>
          <a
            href="https://www.npmjs.com/package/next-docs-zeta"
            rel="noreferrer noopener"
            className="flex flex-row items-center text-sm text-muted-foreground transition-colors hover:text-accent-foreground"
          >
            <ExternalLinkIcon className="mr-2 h-4 w-4" />
            NPM registry
          </a>
        </div>
      </div>
    </footer>
  )
}
