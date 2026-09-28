# PixarByte website

Marketing site for PixarByte, a London software studio. Next.js 16 (App Router), TypeScript (strict), Tailwind CSS v4 and shadcn/ui. British English, prices in GBP.

- **Specs:** `docs/tech-00-Architecture.md` to `docs/tech-06-Contact-Page.md`
- **Visual source of truth:** `docs/pixarbyte-home.html` (the approved home page design)

## Run it locally

You need Node.js 22 and npm.

```bash
npm install
npm run dev          # http://localhost:3000
```

No `.env` file is needed: every external service has a working fallback (see [Environment variables](#environment-variables)), so the contact form works end to end straight away. Submitted leads go to `.data/leads.json`, and emails are printed in full in the terminal.

To try it as production runs it:

```bash
npm run build
npm run start        # http://localhost:3000
```

### Scripts

| Script                       | What it does                                                         |
| ---------------------------- | -------------------------------------------------------------------- |
| `npm run dev`                | Development server                                                   |
| `npm run build`              | Production build                                                     |
| `npm run start`              | Serve the production build                                           |
| `npm run lint`               | ESLint                                                               |
| `npm run typecheck`          | `tsc --noEmit`                                                       |
| `npm run format`             | Prettier (with the Tailwind plugin); `format:check` only checks      |
| `npm test`                   | Unit tests (Vitest, `src/**/*.test.ts`)                              |
| `npm run e2e`                | Playwright smoke tests in `e2e/` (builds, then starts on port 3100)  |
| `npm run check:placeholders` | Launch check: fails while `[placeholder]` text remains in About/team |

For `npm run e2e`, install a browser once with `npx playwright install chromium`, or point `PLAYWRIGHT_CHROMIUM_PATH` at a Chromium you already have. Set `E2E_SKIP_BUILD=1` if you've just built.

**CI** (`.github/workflows/ci.yml`) runs lint, type-check, format check, unit tests, build and the Playwright smoke tests (home page, navigation, contact form validation and axe accessibility checks) on every pull request and on pushes to `main`.

## Environment variables

Copy `.env.example` to `.env.local` for local work, and add the same variables in Vercel (Project → Settings → Environment Variables) for previews and production. Sample values (anything containing `sample`, `placeholder` or `example.com`) count as "not set". Replace one with a real value and that service switches on, with no code changes. `NEXT_PUBLIC_` values are built into the page, so redeploy after changing them.

| Variable                                             | Used for                        | Without it                                                                    | Where to get it                                                           |
| ---------------------------------------------------- | ------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                               | Canonical URLs, sitemap, emails | `https://pixarbyte.co.uk`                                                     | Your live domain                                                          |
| `NEXT_PUBLIC_GA_ID`                                  | Google Analytics 4              | No analytics loaded                                                           | analytics.google.com → Admin → Data streams                               |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`                     | Spam protection (browser)       | Cloudflare's always-pass test key                                             | dash.cloudflare.com → Turnstile → Add widget                              |
| `TURNSTILE_SECRET_KEY`                               | Spam protection (server)        | Cloudflare's always-pass test secret                                          | Same widget                                                               |
| `RESEND_API_KEY`                                     | Sending email                   | Emails printed in full to the server console                                  | resend.com → API Keys (verify your domain first)                          |
| `EMAIL_FROM`                                         | Sender address                  | `PixarByte <hello@pixarbyte.co.uk>`                                           | An address on your Resend-verified domain                                 |
| `LEAD_NOTIFY_EMAIL`                                  | Where new leads are emailed     | `hello@pixarbyte.co.uk`                                                       | Your inbox                                                                |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Rate limiting across instances  | In-memory limiter, same limits                                                | console.upstash.com → database → REST API (or Vercel → Storage → Upstash) |
| `BLOB_READ_WRITE_TOKEN`                              | Attachment uploads              | Files kept in the temp folder, labelled "stored temporarily"                  | Vercel → Storage → Blob → connect to the project                          |
| `LEADS_WEBHOOK_URL`, `LEADS_WEBHOOK_SECRET`          | Sending leads to a CRM or sheet | Leads saved to `.data/leads.json` (on Vercel: the temp folder, not permanent) | Your CRM / Zapier / Make / Google Sheets webhook                          |
| `LEADS_FILE`                                         | Path of the local leads file    | `.data/leads.json`                                                            | Optional                                                                  |
| `NEXT_PUBLIC_CALENDLY_URL`                           | "Book a call" popup             | A "booking calendar coming soon" dialog                                       | calendly.com → Event types → Copy link                                    |
| `NEXT_PUBLIC_WHATSAPP_NUMBER`                        | WhatsApp option on /contact     | Option hidden                                                                 | Your WhatsApp Business number, digits only (e.g. `447700900123`)          |

Each service sits behind a small adapter in `src/lib` (`email.ts`, `ratelimit.ts`, `storage.ts`, `leads.ts`, `turnstile.ts`) that chooses the real service or the fallback. Never commit real keys: `.env*` files other than `.env.example` are git-ignored.

## How the code is organised

```
content/case-studies/  one MDX file per case study (plus _template.mdx)
e2e/                   Playwright smoke tests
src/
  app/                 thin routes: fetch content, compose sections; metadata, sitemap, robots, OG images
  components/
    sections/          one component per page section
    layout/            site-wide client pieces: SiteProvider, dialogs, command menu, mobile menu, toaster
    shared/            Icon sprite, PageHero, PageSection, Breadcrumbs, JsonLd, buttons, Turnstile
    ui/                shadcn/ui components (new-york, Radix)
  data/                all copy and content, typed (British English, GBP)
  emails/              React Email templates
  lib/                 content loaders, validation, service adapters, SEO and schema helpers
  styles/              the design's stylesheet, ported 1:1 from docs/pixarbyte-home.html
public/images/         images (case study artwork in public/images/projects/<slug>/)
```

- **Content** lives in `src/data` and `content/`. Pages read it only through `src/lib/content.ts` and `src/lib/case-studies.ts`, so a CMS can replace the files later without touching components.
- **Server Components by default.** Only interactive leaves are `"use client"`. The quick estimate and booking dialogs load on first use. Third-party scripts (Turnstile, Calendly, Google Analytics) load lazily.
- **Styling.** The approved design's CSS is kept verbatim in `src/styles` (Tailwind's `components` layer). Tokens are in `src/styles/tokens.css`; layout-only additions go in `src/styles/pages.css`.
- **SEO.** `buildMetadata()` in `src/lib/seo.ts` gives every page a title, description, canonical URL and Open Graph/Twitter tags. Each route has an `opengraph-image`. JSON-LD helpers are in `src/lib/schema.ts` (Organization, LocalBusiness, BreadcrumbList, Service, FAQPage, CreativeWork, AboutPage).
- **Security headers** (CSP, HSTS and others) are set in `next.config.ts`. If you add a third-party script, add its domain to the CSP there.

## Adding a case study

1. Copy `content/case-studies/_template.mdx` to `content/case-studies/<slug>.mdx`. The file name must match `slug`.
2. Fill in the frontmatter. `services` uses service slugs (e.g. `mobile-app-development`) and `tech` uses ids from `src/data/tech.ts`. `order` must be unique.
3. Put the images in `public/images/projects/<slug>/` (cover, thumbnail and gallery screens) and reference them as `/images/projects/<slug>/...`. Give every gallery image a meaningful `alt`.
4. Write the story in the MDX body under the template's headings.
5. Run `npm test` and `npm run build`. Invalid frontmatter, unknown tech ids, duplicate `order` values or a slug that doesn't match the file name fail with a clear message.

The page (`/portfolio/<slug>`), its share image, the sitemap entry, the portfolio grid and the related-work sections on service pages all pick it up automatically.

## Adding a service

1. Add the slug to the `ServiceSlug` type in `src/types/content.ts`, and its starting price to `servicePrices` in `src/data/pricing.ts`.
2. Add a `Service` object to `services` in `src/data/services.ts`, copying an existing one. It includes the SEO title and description, hero, offerings, process, FAQs and related services. Icons must exist in `src/lib/icons.tsx`, and tech ids in `src/data/tech.ts`.
3. So visitors can choose it on the quote form, add the slug to `serviceOptions` in `src/lib/validation/quote.ts` and a label in `quoteOptions.services` in `src/data/contact.ts`.
4. Optionally add it to the home bento (`homeBento`), the service finder (`finderOptions`), a pricing package group (`packageGroups`) and the footer (`src/data/footer.ts`).
5. Run `npm test` and `npm run build`. The content is checked against `src/lib/validation/service.ts` when it loads, so mistakes fail the build rather than a page.

`/services/<slug>`, its share image, JSON-LD, the header menu and the sitemap are generated from the data.

## Before launch

- Replace `[placeholder]` text in the About and team data (`npm run check:placeholders`), the company number and phone number in `src/data/site.ts`.
- Set the environment variables above, especially a permanent lead store (`LEADS_WEBHOOK_URL`) and Resend.
- Add Privacy, Terms and Cookies pages and link the quote form's consent text to the privacy notice.

## Adding shadcn/ui components

`components.json` is configured, so `npx shadcn@latest add <component>` works where `ui.shadcn.com` is reachable. The components in `src/components/ui` were vendored from the shadcn repository's `new-york-v4` sources because the registry host was blocked in the environment used to set up the project.
