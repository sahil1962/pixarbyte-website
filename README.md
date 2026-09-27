# PixarByte website

Marketing site for PixarByte, a London software studio. Next.js App Router, TypeScript (strict), Tailwind CSS v4, shadcn/ui.

- **Specs:** `docs/tech-00-Architecture.md` to `docs/tech-06-Contact-Page.md`
- **Visual source of truth:** `docs/pixarbyte-home.html` (the approved home page design)

## Getting started

```bash
npm install
cp .env.example .env.local   # optional for the home page
npm run dev                  # http://localhost:3000
```

| Script              | What it does                    |
| ------------------- | ------------------------------- |
| `npm run dev`       | Development server              |
| `npm run build`     | Production build (all static)   |
| `npm run lint`      | ESLint                          |
| `npm run typecheck` | `tsc --noEmit`                  |
| `npm run format`    | Prettier (with Tailwind plugin) |

## How the code is organised

```
src/
  app/                 thin routes: fetch content, compose sections
  components/
    sections/          one component per page section (Header, Hero, Services, ..., Footer)
    layout/            site-wide client pieces: SiteProvider, EstimateDialog, CommandMenu, MobileMenu, Toaster
    shared/            Icon sprite, Brand, SectionHead, Stars, Segmented, trigger buttons
    ui/                shadcn/ui components (new-york, Radix)
  data/                all copy and content, typed (British English, GBP)
  lib/                 content loaders, formatting, hooks, SEO and schema helpers
  styles/              the design's stylesheet, ported 1:1 from docs/pixarbyte-home.html
  types/content.ts     content types
```

- **Content** lives only in `src/data`. Components get it as props; pages and layouts read it through the loaders in `src/lib/content.ts`, so a CMS can replace the data files later without touching components.
- **Server Components by default.** Sections render on the server; only interactive leaves (builder, dialogs, switches, counters, canvases) are `"use client"`.
- **Styling.** The approved design's CSS is kept verbatim in `src/styles` (in Tailwind's `components` layer) so the page matches it pixel for pixel. Design tokens are exposed to Tailwind and shadcn/ui in `src/app/globals.css`, so new pages can use utilities such as `bg-background` or `text-muted-foreground`. Note: the design's blue accent is `brand` in Tailwind, because shadcn uses `accent` for hover surfaces.
- **Theme.** Follows the OS until the visitor toggles it (header button, command menu, or ⌘/Ctrl J); the resolved theme is set on `<html data-theme>` before first paint. Tailwind's `dark:` variant follows it.
- **Motion** respects `prefers-reduced-motion`: marquees become static rows, autoplay is off, and transitions are instant.

## Adding shadcn/ui components

`components.json` is configured, so `npx shadcn@latest add <component>` works where `ui.shadcn.com` is reachable. The components in `src/components/ui` were vendored from the shadcn repository's `new-york-v4` sources because the registry host was blocked in the environment used to set up the project.
