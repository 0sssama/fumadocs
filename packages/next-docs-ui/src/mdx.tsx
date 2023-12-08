'use client'

import { Pre } from '@/internal/mdx-client'
import serverComponents, {
  Card,
  Cards,
  default_image_sizes,
  Heading,
  Image,
  Link,
  MDXContent,
  Table
} from '@/internal/mdx-server'
import type { HTMLAttributes } from 'react'

const defaultMdxComponents = {
  pre: (p: HTMLAttributes<HTMLPreElement>) => <Pre {...p} />,
  ...serverComponents
}

export {
  defaultMdxComponents as default,
  Pre,
  Card,
  Cards,
  Heading,
  Image,
  Link,
  MDXContent,
  Table,
  default_image_sizes
}
