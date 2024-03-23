'use client';

import { useEffect, useMemo, useState } from 'react';
import { cva } from 'class-variance-authority';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n } from './contexts/i18n';
import { useTreeContext } from './contexts/tree';

export * from '@/components/toc';
export * from '@/components/breadcrumb';

export function LastUpdate(props: { date: Date }): React.ReactElement {
  const { text } = useI18n();
  const [date, setDate] = useState('');

  useEffect(() => {
    // to the timezone of client
    setDate(props.date.toLocaleDateString());
  }, [props.date]);

  return (
    <p className="mt-8 text-xs text-muted-foreground">
      {text.lastUpdate} {date}
    </p>
  );
}

export interface FooterProps {
  /**
   * Items including information for the next and previous page
   */
  items?: {
    previous?: { name: string; url: string };
    next?: { name: string; url: string };
  };
}

const footerItem = cva(
  'flex flex-row items-center gap-2 text-muted-foreground transition-colors hover:text-foreground',
);

export function Footer({ items }: FooterProps): React.ReactElement {
  const tree = useTreeContext();
  const pathname = usePathname();

  const { previous, next } = useMemo(() => {
    if (items) return items;
    const currentIndex = tree.navigation.findIndex(
      (item) => item.url === pathname,
    );

    return {
      previous: tree.navigation[currentIndex - 1],
      next: tree.navigation[currentIndex + 1],
    };
  }, [items, pathname, tree.navigation]);

  return (
    <div className="mt-4 flex flex-row flex-wrap gap-4 border-t py-12">
      {previous ? (
        <Link href={previous.url} className={footerItem()}>
          <ChevronLeftIcon className="size-5 shrink-0 rtl:rotate-180" />
          <p className="font-medium text-foreground">{previous.name}</p>
        </Link>
      ) : null}
      {next ? (
        <Link href={next.url} className={footerItem({ className: 'ms-auto' })}>
          <p className="text-end font-medium text-foreground">{next.name}</p>
          <ChevronRightIcon className="size-5 shrink-0 rtl:rotate-180" />
        </Link>
      ) : null}
    </div>
  );
}
