import { allDocs, allMeta } from 'contentlayer/generated';
import { createContentlayerSource } from '@fuma-docs/core/contentlayer';
import { loader } from '@fuma-docs/core/source';

export const { pageTree, getPages, getPage } = loader({
  baseUrl: '/docs',
  rootDir: 'docs',
  source: createContentlayerSource(allMeta, allDocs),
});
