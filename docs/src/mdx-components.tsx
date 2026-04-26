import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { LinkPreviewDemo } from '@/components/LinkPreviewDemo';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    LinkPreviewDemo,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
