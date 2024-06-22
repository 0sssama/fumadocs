'use client';

import { HTMLAttributes, useCallback, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { buttonVariants } from '@/theme/variants';

export function Banner({
  id,
  ...props
}: HTMLAttributes<HTMLDivElement>): React.ReactElement {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (id) setOpen(localStorage.getItem(`nd-banner-${id}`) !== 'true');
  }, [id]);

  const onClick = useCallback(() => {
    setOpen(false);
    if (id) localStorage.setItem(`nd-banner-${id}`, 'true');
  }, [id]);

  return (
    <div
      id={id}
      {...props}
      className={cn(
        'flex h-12 flex-row items-center justify-center bg-secondary px-4 text-center text-sm font-medium',
        !open && 'hidden',
        props.className,
      )}
      suppressHydrationWarning
    >
      {id ? (
        <script
          dangerouslySetInnerHTML={{
            __html: `const item = localStorage.getItem('nd-banner-${id}');
   if (item === 'true') {
     document.getElementById('${id}').style.display = 'none';
   }`,
          }}
        />
      ) : null}
      {props.children}
      {id ? (
        <button
          aria-label="Close Banner"
          onClick={onClick}
          className={cn(
            buttonVariants({
              color: 'ghost',
              className: 'absolute end-2 top-3 text-muted-foreground',
              size: 'icon',
            }),
          )}
        >
          <X />
        </button>
      ) : null}
    </div>
  );
}
