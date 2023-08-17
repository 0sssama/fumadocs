'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/utils/cn'
import { CheckIcon, CopyIcon } from 'lucide-react'
import type { ComponentPropsWithoutRef } from 'react'
import { useEffect, useRef, useState } from 'react'

type PreProps = ComponentPropsWithoutRef<'pre'> & {
  allowCopy?: boolean
}

export function Pre({ title, allowCopy = true, ...props }: PreProps) {
  const ref = useRef<HTMLPreElement>(null)
  const onCopy = () => {
    if (ref.current == null || ref.current.textContent == null) return

    navigator.clipboard.writeText(ref.current.textContent)
  }

  return (
    <div
      className="nd-relative nd-group nd-border nd-rounded-lg nd-overflow-hidden nd-text-sm nd-bg-secondary/50 nd-not-prose"
      data-rehype-pretty-code-fragment
    >
      {title && (
        <div className="nd-text-muted-foreground nd-bg-muted nd-pl-4 nd-pr-12 nd-py-2 nd-border-b nd-z-[2]">
          {title}
        </div>
      )}
      {allowCopy && (
        <CopyButton
          className={
            title
              ? 'nd-absolute nd-top-1 nd-right-2'
              : 'nd-absolute nd-top-2 nd-right-2'
          }
          onCopy={onCopy}
        />
      )}
      <ScrollArea>
        <pre {...props} ref={ref}>
          {props.children}
        </pre>
      </ScrollArea>
    </div>
  )
}

function CopyButton({
  className,
  onCopy
}: {
  className: string
  onCopy: () => void
}) {
  const [checked, setChecked] = useState(false)

  const onClick = () => {
    onCopy()
    setChecked(true)
  }

  useEffect(() => {
    if (!checked) return

    const timer = setTimeout(() => {
      setChecked(false)
    }, 1500)

    return () => {
      clearTimeout(timer)
    }
  }, [checked])

  return (
    <button
      className={cn(
        'nd-p-2 nd-bg-secondary nd-rounded-md nd-transition-opacity nd-text-secondary-foreground nd-z-[2] nd-opacity-0 group-hover:nd-opacity-100',
        checked && 'nd-opacity-100',
        className
      )}
      aria-label="Copy Text"
      onClick={onClick}
    >
      <CheckIcon
        className={cn(
          'nd-absolute nd-w-3.5 nd-h-3.5 nd-transition-transform',
          !checked && 'nd-scale-0'
        )}
      />

      <CopyIcon
        className={cn(
          'nd-w-3.5 nd-h-3.5 nd-transition-transform',
          checked && 'nd-scale-0'
        )}
      />
    </button>
  )
}
