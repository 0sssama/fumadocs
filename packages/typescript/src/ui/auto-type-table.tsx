import { TypeTable } from 'fumadocs-ui/components/type-table';
import { renderMarkdown } from '@/markdown';
import type { TypescriptConfig } from '@/generate/program';
import { generateDocumentation } from '../generate/base';
import 'server-only';

/**
 * **Server Component Only**
 *
 * Display properties in an exported interface via Type Table
 */
export function AutoTypeTable({
  path,
  name,
  options,
}: {
  path: string;
  name: string;
  options?: TypescriptConfig;
}): JSX.Element {
  const output = generateDocumentation({ file: path, name, options });

  if (!output) throw new Error(`${name} in ${path} doesn't exist`);

  return (
    <TypeTable
      type={Object.fromEntries(
        output.entries.map((entry) => [
          entry.name,
          {
            type: entry.type,
            description: renderMarkdown(entry.description),
            default: entry.tags.default || entry.tags.defaultValue,
          },
        ]),
      )}
    />
  );
}
