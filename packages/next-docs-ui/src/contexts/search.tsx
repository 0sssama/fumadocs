import dynamic from 'next/dynamic'
import type { ComponentType, ReactNode } from 'react'
import { createContext, useEffect, useState } from 'react'
import type { SharedProps } from '../components/dialog/search'

const DefaultSearchDialog = dynamic(
  () => import('../components/dialog/search-default')
)

export type SearchProviderProps = {
  /**
   * Custom links to be displayed if search is empty
   */
  links?: [name: string, link: string][]

  /**
   * Replace default search dialog, allowing you to use other solutions such as Algolia Search
   *
   * It receives the `open` and `onOpenChange` prop, lazy loaded with `next/dynamic`
   */
  SearchDialog?: ComponentType<SharedProps>

  children: ReactNode
}

export const SearchContext = createContext<
  [setOpenSearch: (value: boolean) => void]
>([() => {}])

export function SearchProvider(props: SearchProviderProps) {
  const [isOpen, setOpen] = useState<boolean>()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        setOpen(true)
        e.preventDefault()
      }
    }

    window.addEventListener('keydown', handler)

    return () => {
      window.removeEventListener('keydown', handler)
    }
  }, [])

  const SearchDialog = props.SearchDialog ?? DefaultSearchDialog

  return (
    <SearchContext.Provider value={[setOpen]}>
      {isOpen !== undefined && (
        <SearchDialog
          open={isOpen}
          onOpenChange={setOpen}
          links={props.links}
        />
      )}
      {props.children}
    </SearchContext.Provider>
  )
}
