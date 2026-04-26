# Docs site

Documentation site for `react-native-preview-url`, built with
[Fumadocs](https://fumadocs.dev) on Next.js 16.

## Local development

From the repo root:

```sh
yarn docs:dev    # Next.js dev server on http://localhost:3000
yarn docs:build  # production build
```

The library is consumed via a workspace symlink. A `postinstall` script
(`scripts/link-workspace-root.mjs`) creates the symlink because Yarn 3 doesn't
auto-link the root workspace into a sibling workspace's `node_modules`.

The site uses `react-native-web` to render the actual `LinkPreview` component
inside MDX (`<LinkPreviewDemo url="..." />`). The aliasing happens in
`next.config.mjs`.

## Deploy to Vercel

1. Connect this repo to a Vercel project.
2. **Root Directory**: `docs`
3. **Framework Preset**: Next.js (auto-detected)
4. **Build Command**: `yarn build` (auto-detected)
5. **Install Command**: `yarn install` (Vercel runs from the repo root since
   it's a yarn workspace)

No env vars are required — the site is fully static apart from the
`/api/search` route.

## Content

MDX lives under `content/docs/`. The page tree is generated automatically
from filenames and `meta.json` — see
[Page Conventions](https://fumadocs.dev/docs/page-conventions).

To add a new page:

1. Create `content/docs/my-page.mdx` with `title:` + `description:` frontmatter.
2. Add the slug to `content/docs/meta.json` if you want to control its
   position (otherwise it will sort alphabetically).
