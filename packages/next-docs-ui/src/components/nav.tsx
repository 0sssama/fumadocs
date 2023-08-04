import { MenuIcon } from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { SearchBar } from './search-toggle'
import { SidebarTrigger } from './sidebar'
import { ThemeToggle } from './theme-toggle'

type NavLinkProps = {
  icon: ReactNode
  href: string
  external?: boolean
}

export function Nav({
  links,
  enableSidebar = true,
  children
}: {
  links?: NavLinkProps[]
  enableSidebar?: boolean
  children: ReactNode
}) {
  return (
    <nav className="nd-sticky nd-top-0 nd-inset-x-0 nd-z-50 nd-backdrop-blur-xl">
      <div className="nd-container nd-flex nd-flex-row nd-items-center nd-h-16 nd-gap-4 nd-border-b nd-border-foreground/10 nd-max-w-[1300px]">
        {children}
        <div className="nd-flex nd-flex-row nd-justify-end nd-items-center nd-flex-1">
          <SearchBar className="nd-w-full nd-max-w-[280px] nd-mr-3 max-md:nd-hidden" />
          {links?.map((item, key) => <NavLink key={key} {...item} />)}
          <ThemeToggle />
          {enableSidebar && (
            <SidebarTrigger
              aria-label="Toggle Sidebar"
              className="nd-p-2 nd-rounded-md hover:nd-bg-accent lg:nd-hidden"
            >
              <MenuIcon className="nd-w-5 nd-h-5" />
            </SidebarTrigger>
          )}
        </div>
      </div>
    </nav>
  )
}

export function NavLink(props: NavLinkProps) {
  return (
    <Link
      href={props.href}
      target={props.external ? '_blank' : '_self'}
      rel={props.external ? 'noreferrer noopener' : undefined}
      className="nd-p-2 nd-rounded-md hover:nd-bg-accent max-sm:nd-hidden"
    >
      {props.icon}
    </Link>
  )
}
