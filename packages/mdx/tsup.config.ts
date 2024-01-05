import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['./src/{config,index,loader,loader-mdx}.ts'],
  format: 'esm',
  external: ['next-docs-zeta', 'webpack'],
  dts: true,
  target: 'es6',
});
