import { cn } from '@/utils/cn'
import { modes } from '@/utils/modes'
import { getTree } from '@/utils/source'
import { DocsLayout } from 'next-docs-ui/layout'
import type { ReactNode } from 'react'

export default function Layout({
  params,
  children
}: {
  params: { mode: string }
  children: ReactNode
}) {
  const tree = getTree(params.mode)
  const mode = modes.find(mode => mode.param === params.mode) ?? modes[0]
  const Icon = mode.icon

  return (
    <main
      className={cn(
        params.mode === 'ui' &&
          '[--primary:213_98%_48%] dark:[--primary:213_94%_68%]',
        params.mode === 'headless' &&
          '[--primary:270_95%_60%] dark:[--primary:270_95%_75%]'
      )}
    >
      <DocsLayout
        tree={tree}
        nav={{ enabled: false }}
        sidebar={{
          defaultOpenLevel: 0,
          banner: (
            <div className="relative flex flex-row gap-3 items-center p-2 rounded-lg border bg-card text-card-foreground transition-colors hover:bg-muted/80">
              <Icon className="w-7 h-7 p-1 shrink-0 rounded-md text-primary bg-primary/10 border" />
              <div>
                <p className="font-medium">{mode.name}</p>
              </div>
            </div>
          )
        }}
      >
        {children}
      </DocsLayout>
    </main>
  )
}

export function generateStaticParams() {
  return modes.map(mode => ({
    mode: mode.param
  }))
}
