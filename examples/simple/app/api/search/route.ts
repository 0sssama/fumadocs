import { getPages } from '@/app/source';
import { createSearchAPI } from 'next-docs-zeta/search/server';

export const { GET } = createSearchAPI('simple', {
  indexes: getPages()!.map((page) => ({
    title: page.data.title,
    content: page.data.body.raw,
    url: page.url,
  })),
});
