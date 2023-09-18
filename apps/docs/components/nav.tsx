'use client'

import { cn } from '@/utils/cn'
import { cva } from 'class-variance-authority'
import { GithubIcon } from 'lucide-react'
import { Nav as OriginalNav } from 'next-docs-ui/components'
import { SidebarContext } from 'next-docs-zeta/sidebar'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useContext, useEffect, useState } from 'react'

const item = cva(
  'px-2 py-1 rounded-md text-muted-foreground transition-colors hover:text-accent-foreground',
  {
    variants: {
      active: {
        true: 'bg-accent text-accent-foreground'
      }
    }
  }
)
export function Nav() {
  const { mode } = useParams()
  const [isSidebarOpen] = useContext(SidebarContext)
  const [transparent, setTransparent] = useState(true)

  useEffect(() => {
    if (isSidebarOpen) {
      setTransparent(true)
      return
    }

    const listener = () => {
      setTransparent(window.document.scrollingElement!.scrollTop < 30)
    }

    listener()
    window.addEventListener('scroll', listener)
    return () => window.removeEventListener('scroll', listener)
  }, [isSidebarOpen])

  return (
    <OriginalNav
      title="Next Docs"
      enableSidebar={mode === 'headless' || mode === 'ui'}
      links={[
        {
          label: 'Github',
          icon: <GithubIcon className="h-5 w-5" />,
          href: 'https://github.com/fuma-nama/next-docs',
          external: true
        }
      ]}
      items={[
        {
          href: '/showcase',
          children: 'Showcase'
        }
      ]}
      transparent={transparent}
    >
      <div className="max-sm:absolute max-sm:left-[50%] max-sm:translate-x-[-50%]">
        <div className="bg-secondary/50 rounded-md border p-1 text-sm">
          <Link
            href="/docs/headless"
            className={cn(item({ active: mode === 'headless' }))}
          >
            Zeta
          </Link>
          <Link href="/docs/ui" className={cn(item({ active: mode === 'ui' }))}>
            UI
          </Link>
        </div>
      </div>
    </OriginalNav>
  )
}
