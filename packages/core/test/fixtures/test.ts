export interface Test1 {
  name: string;
  /**
   * @defaultValue 4
   */
  age?: number;
}

export type Test2 = Test1 & {
  generic: GenericType<string, string, string>;
};

export type { BreadcrumbItem as Test3 } from '@/breadcrumb';

interface GenericType<A, B, C> {
  A: A;
  B: B;
  C: C;
}
