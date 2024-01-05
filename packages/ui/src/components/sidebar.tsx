import { cva } from 'class-variance-authority';
import { ChevronDown } from 'lucide-react';
import type { PageTree } from 'next-docs-zeta/server';
import * as Base from 'next-docs-zeta/sidebar';
import { usePathname } from 'next/navigation';
import type { HTMLAttributes, ReactNode } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import Link from 'next-docs-zeta/link';
import { cn } from '@/utils/cn';
import type { LinkItem } from '@/contexts/tree';
import { useTreeContext } from '@/contexts/tree';
import { useSidebarCollapse } from '@/contexts/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { hasActive, isActive } from '@/utils/shared';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible';
import { ThemeToggle } from './theme-toggle';

export interface SidebarProps {
  items?: LinkItem[];
  defaultOpenLevel?: number;
  banner?: ReactNode;
  footer?: ReactNode;
}

const itemVariants = cva(
  'flex flex-row items-center gap-2 rounded-md px-2 py-1.5 text-muted-foreground [&_svg]:h-4 [&_svg]:w-4',
  {
    variants: {
      active: {
        true: 'bg-primary/10 font-medium text-primary',
        false: 'hover:bg-accent/50 hover:text-accent-foreground/80',
      },
    },
  },
);

const SidebarContext = createContext({
  defaultOpenLevel: 1,
});

export function Sidebar({
  banner,
  footer,
  items = [],
  defaultOpenLevel = 1,
}: SidebarProps): JSX.Element {
  const [open] = useSidebarCollapse();
  const { root } = useTreeContext();

  return (
    <Base.SidebarList
      minWidth={768} // md
      className={cn(
        'flex w-full flex-col text-medium',
        !open
          ? 'md:hidden'
          : 'md:sticky md:top-16 md:h-body md:w-[240px] md:text-sm xl:w-[260px]',
        'max-md:fixed max-md:inset-0 max-md:z-40 max-md:bg-background/80 max-md:pt-16 max-md:backdrop-blur-sm max-md:data-[open=false]:hidden',
      )}
    >
      <SidebarContext.Provider value={{ defaultOpenLevel }}>
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-8 pb-10 pt-4 max-md:px-4 md:pr-4 md:pt-10">
            {banner}
            <div className="lg:hidden">
              {items.map((item) => (
                <BaseItem key={item.url} item={item} nested />
              ))}
            </div>
            <NodeList items={root.children} />
          </div>
        </ScrollArea>
        <div
          className={cn(
            'flex flex-row items-center gap-2 border-t py-2 max-md:px-4',
            !footer && 'md:hidden',
          )}
        >
          {footer}
          <ThemeToggle className="md:hidden" />
        </div>
      </SidebarContext.Provider>
    </Base.SidebarList>
  );
}

interface NodeListProps extends HTMLAttributes<HTMLDivElement> {
  items: PageTree.Node[];
  level?: number;
}

function NodeList({ items, level = 0, ...props }: NodeListProps): JSX.Element {
  return (
    <div {...props}>
      {items.map((item) => {
        const id = `${item.type}_${item.name}`;

        switch (item.type) {
          case 'separator':
            return <SeparatorNode key={id} item={item} />;
          case 'folder':
            return <Folder key={id} item={item} level={level + 1} />;
          default:
            return (
              <BaseItem
                key={item.url}
                item={{ text: item.name, url: item.url, icon: item.icon }}
              />
            );
        }
      })}
    </div>
  );
}

function BaseItem({
  item,
  nested = false,
}: {
  item: LinkItem;
  nested?: boolean;
}): JSX.Element {
  const pathname = usePathname();
  const active = isActive(item.url, pathname, nested);

  return (
    <Link
      href={item.url}
      external={item.external}
      className={cn(itemVariants({ active }))}
    >
      {item.icon}
      {item.text}
    </Link>
  );
}

function Folder({
  item: { name, children, index, icon },
  level,
}: {
  item: PageTree.Folder;
  level: number;
}): JSX.Element {
  const { defaultOpenLevel } = useContext(SidebarContext);
  const pathname = usePathname();
  const active = index && isActive(index.url, pathname, false);
  const childActive = useMemo(
    () => hasActive(children, pathname),
    [children, pathname],
  );
  const [extend, setExtend] = useState(
    active || childActive || defaultOpenLevel >= level,
  );

  useEffect(() => {
    if (active || childActive) setExtend(true);
  }, [active, childActive]);

  const content = (
    <>
      {icon}
      {name}
      <ChevronDown
        onClick={(e) => {
          setExtend((prev) => !prev);
          e.preventDefault();
        }}
        className={cn('ml-auto transition-transform', !extend && '-rotate-90')}
      />
    </>
  );

  return (
    <Collapsible
      open={extend}
      onOpenChange={!index || active ? setExtend : undefined}
    >
      <CollapsibleTrigger
        className={cn(itemVariants({ active, className: 'w-full' }))}
        asChild
      >
        {index ? (
          <Link href={index.url}>{content}</Link>
        ) : (
          <button type="button">{content}</button>
        )}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <NodeList
          className="ml-4 flex flex-col border-l py-2 pl-2"
          items={children}
          level={level}
        />
      </CollapsibleContent>
    </Collapsible>
  );
}

function SeparatorNode({ item }: { item: PageTree.Separator }): JSX.Element {
  return <p className="mb-2 mt-8 px-2 font-medium first:mt-0">{item.name}</p>;
}
