'use client'

import { Breadcrumb } from '@/components/breadcrumb'
import type { FooterProps } from '@/components/mdx/footer'
import { Footer } from '@/components/mdx/footer'
import { TOC } from '@/components/toc'
import type { TableOfContents, TreeNode } from 'next-docs-zeta/server'
import type { ReactNode } from 'react'

export type DocsPageProps = {
  toc: TableOfContents

  /**
   * Custom content in TOC container
   */
  tocContent?: ReactNode
  tree: TreeNode[]
  children: ReactNode
  footer?: FooterProps | false
}

export function DocsPage(props: DocsPageProps) {
  return (
    <>
      <article className="nd-flex nd-flex-col nd-gap-6 nd-py-8 md:nd-py-16">
        <Breadcrumb tree={props.tree} />
        {props.children}
        {props.footer != null && props.footer !== false && (
          <Footer {...props.footer} />
        )}
      </article>
      <div className="nd-relative max-xl:nd-hidden">
        <div className="nd-sticky nd-flex nd-flex-col nd-top-14 nd-py-16 nd-max-h-[calc(100vh-3.5rem)]">
          <TOC items={props.toc} />
          {props.tocContent}
        </div>
      </div>
    </>
  )
}
