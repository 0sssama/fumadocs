import { allDocs, allMeta } from 'contentlayer/generated';
import { createContentlayerSource } from 'next-docs-zeta/contentlayer';
import { loader } from 'next-docs-zeta/source';

export const { pageTree, getPages, getPage } = loader({
  baseUrl: '/docs',
  rootDir: 'docs',
  source: createContentlayerSource(allMeta, allDocs),
});
