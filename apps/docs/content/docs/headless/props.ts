import type * as Breadcrumb from 'fumadocs-core/breadcrumb';
import type * as TOC from 'fumadocs-core/toc';
import type * as Server from 'fumadocs-core/server';
import type * as Sidebar from 'fumadocs-core/sidebar';
import type { SortedResult as OriginalSortedResult } from 'fumadocs-core/search/shared';
import type { ComponentPropsWithoutRef, ElementType } from 'react';

export type SortedResult = OriginalSortedResult;

export type BreadcrumbItem = Breadcrumb.BreadcrumbItem;

export type SidebarProviderProps = Sidebar.SidebarProviderProps;
export type SidebarTriggerProps = Sidebar.SidebarTriggerProps<ElementType>;

export type TOCProviderProps = Omit<
  ComponentPropsWithoutRef<typeof TOC.TOCProvider>,
  keyof ComponentPropsWithoutRef<'div'>
>;

export type TOCItemProps = Omit<
  ComponentPropsWithoutRef<typeof TOC.TOCItem>,
  keyof ComponentPropsWithoutRef<'a'>
>;

export type TOCItemType = Server.TOCItemType;
