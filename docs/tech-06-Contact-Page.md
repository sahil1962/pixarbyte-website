# Contact / Get a Quote: Technical Specification

**Routes:**
- `/contact` → `src/app/contact/page.tsx` + `src/app/contact/actions.ts`
- `/thank-you` → `src/app/thank-you/page.tsx`
- `/get-a-quote` → permanent redirect to `/contact` (in `next.config.ts`)

**Rendering:** Page is static; the form is a client component that submits to a **Server Action**.
**Services used:** Resend (email), Cloudflare Turnstile (spam), Vercel Blob (attachments), Upstash Redis (rate limiting), optional CRM/Sheet webhook.

This is the most important page technically: it's where money comes in. Reliability and spam protection are the priorities.

---

## 1. Architecture Overview

```
Browser (QuoteForm, client)
  │  React Hook Form + Zod (instant validation)
  │  Turnstile token
  │  (attachments uploaded directly to Vercel Blob → URLs)
  ▼
Server Action: submitQuote(formData)
  1. Rate limit by IP (Upstash)
  2. Honeypot check
  3. Verify Turnstile token with Cloudflare
  4. Re-validate with the same Zod schema
  5. Save lead (DB / Google Sheet / CRM webhook)
  6. Send internal notification email (Resend)
  7. Send auto-reply to client (Resend)
  8. Return { ok: true } → client redirects to /thank-you
```

Steps 6–7 run in parallel with `Promise.allSettled` so a failed auto-reply never loses the lead. Step 5 happens before emails so the lead is stored even if email fails.

---

## 2. Validation Schema (shared client + server)

```ts
// src/lib/validation/quote.ts
import { z } from "zod";

export const clientTypes = ["individual", "startup", "business", "agency"] as const;
export const serviceOptions = [
  "frontend-development", "backend-development", "full-stack-development",
  "no-code-development", "mobile-app-development", "cloud-services", "not-sure",
] as const;
export const budgetOptions = ["<500", "500-2000", "2000-5000", "5000-15000", "15000+", "not-sure"] as const;
export const timelineOptions = ["asap", "1-3m", "3-6m", "flexible"] as const;
export const projectTypes = ["new", "redesign", "features", "maintenance", "consultation"] as const;

export const quoteSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Please enter a valid email"),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  clientType: z.enum(clientTypes, { message: "Please choose one" }),
  services: z.array(z.enum(serviceOptions)).min(1, "Select at least one service"),
  projectType: z.enum(projectTypes).optional(),
  budget: z.enum(budgetOptions, { message: "Please select a budget range" }),
  timeline: z.enum(timelineOptions).optional(),
  description: z.string().trim().min(20, "Tell us a bit more (at least 20 characters)").max(5000),
  attachments: z.array(z.string().url()).max(3).default([]),
  source: z.string().max(60).optional(),
  wantsNda: z.boolean().default(false),
  consent: z.literal(true, { message: "Please accept the Privacy Policy" }),
  turnstileToken: z.string().min(1, "Please complete the verification"),
  website: z.string().max(0).optional(), // honeypot: must stay empty
  meta: z.object({ estimate: z.string().optional(), package: z.string().optional(), model: z.string().optional() }).optional(),
});

export type QuoteInput = z.infer<typeof quoteSchema>;
```

---

## 3. Page Component

```tsx
// src/app/contact/page.tsx
import { Suspense } from "react";

export const metadata = buildMetadata({
  title: "Contact Us | Get a Free Quote for Your Project",
  description: "Tell us about your web, mobile, or cloud project and get a free consultation and estimate within 24 hours.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero title="Let's Build Something Together"
        subtitle="Tell us about your project. We'll get back to you within 24 hours with ideas and a free estimate."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
      <Container className="grid gap-12 lg:grid-cols-[3fr_2fr]">
        <Suspense fallback={<FormSkeleton />}>
          <QuoteForm />
        </Suspense>
        <aside className="space-y-8">
          <ContactOptions />
          <Reassurance />
        </aside>
      </Container>
      <NextSteps />
      {siteConfig.showMap && <OfficeMap />}
      <FAQSection faqs={contactFaqs} />
      <JsonLd data={localBusinessSchema()} />
    </>
  );
}
```
`QuoteForm` reads URL params (`useSearchParams`), so it needs the `Suspense` boundary.

---

## 4. `QuoteForm` (Client)

### Setup
```tsx
"use client";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useRouter } from "next/navigation";
import { useTransition, useState, useEffect } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import { quoteSchema, type QuoteInput } from "@/lib/validation/quote";
import { submitQuote } from "@/app/contact/actions";

export function QuoteForm() {
  const params = useSearchParams();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<QuoteInput>({
    resolver: zodResolver(quoteSchema),
    mode: "onTouched",
    defaultValues: prefillFromParams(params),
  });

  // track first interaction once
  const [started, setStarted] = useState(false);
  const onFirstFocus = () => { if (!started) { setStarted(true); sendGAEvent("event", "quote_form_start"); } };

  const onSubmit = (values: QuoteInput) => {
    setServerError(null);
    startTransition(async () => {
      const res = await submitQuote(values);
      if (res.ok) {
        sendGAEvent("event", "quote_form_submit", { services: values.services.join(","), budget: values.budget });
        router.push(`/thank-you?name=${encodeURIComponent(values.name.split(" ")[0])}`);
      } else {
        setServerError(res.error);
        if (res.fieldErrors) Object.entries(res.fieldErrors).forEach(([k, msg]) =>
          form.setError(k as keyof QuoteInput, { message: msg }));
      }
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} onFocus={onFirstFocus} noValidate aria-describedby="form-status">
      {/* fields… */}
    </form>
  );
}
```
The Server Action is called directly as an async function, which works well with React Hook Form's object values (arrays, booleans) without manual FormData parsing.

### Prefill from URL (`lib/quote-prefill.ts`)
Other pages link here with context:

| Param | Source | Prefills |
|---|---|---|
| `?service=mobile-app-development` | Service page CTA | `services: [value]` |
| `?type=individual` / `business` | Home audience split | `clientType` |
| `?package=websites-business` | Pricing tier CTA | `meta.package` + description intro |
| `?model=hourly` | Engagement model CTA | `meta.model` |
| `?estimate=<json>` | Cost estimator | `meta.estimate` + readable summary in description |

```ts
export function prefillFromParams(p: URLSearchParams): Partial<QuoteInput> {
  const service = p.get("service");
  const type = p.get("type");
  const validService = serviceOptions.includes(service as any) ? [service as any] : [];
  return {
    services: validService,
    clientType: clientTypes.includes(type as any) ? (type as any) : undefined,
    description: buildDescriptionFromEstimate(p.get("estimate")) ?? "",
    meta: { package: p.get("package") ?? undefined, model: p.get("model") ?? undefined, estimate: p.get("estimate") ?? undefined },
    attachments: [], wantsNda: false,
  };
}
```
Always whitelist param values; never trust raw query strings.

### Field implementation

| Field | Component | Notes |
|---|---|---|
| name, email, company | shadcn `Input` | `autoComplete="name" / "email" / "organization"` |
| phone | `Input type="tel"` + country code `Select` | Default +92; `autoComplete="tel"` |
| clientType | `RadioGroup` (card style) | `Controller` wrapper |
| services | Checkbox grid | `Controller`, value array |
| projectType, budget, timeline, source | shadcn `Select` | `Controller` wrapper |
| description | `Textarea` + live character counter | `rows={6}`, max 5000 |
| attachments | `AttachmentUploader` (below) | Stores returned URLs |
| wantsNda, consent | `Checkbox` | Consent label links to `/privacy` |
| website (honeypot) | Hidden input | Visually hidden via CSS (not `type="hidden"`), `tabIndex={-1}`, `autoComplete="off"`, `aria-hidden` |
| turnstileToken | `Turnstile` widget | Sets value via `form.setValue` |

**Reusable field wrapper** keeps accessibility consistent:
```tsx
export function Field({ id, label, error, required, hint, children }: FieldProps) {
  const errorId = `${id}-error`, hintId = `${id}-hint`;
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}{required && <span aria-hidden className="text-red-600"> *</span>}</Label>
      {React.cloneElement(children, {
        id, "aria-invalid": !!error, "aria-required": required,
        "aria-describedby": [hint && hintId, error && errorId].filter(Boolean).join(" ") || undefined,
      })}
      {hint && <p id={hintId} className="text-sm text-ink-600">{hint}</p>}
      {error && <p id={errorId} role="alert" className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
```
On submit with errors, focus moves to the first invalid field (React Hook Form's `shouldFocusError` default).

### Multi-step variant (optional)
Split into 3 steps (About you → Your project → Details). Validate per step with `form.trigger(["name","email","clientType"])` before advancing. Show progress bar with `aria-valuenow`. Submit only on the final step. Keep all steps in one form so data persists when going back.

### Turnstile
```tsx
// npm i @marsidev/react-turnstile
import { Turnstile } from "@marsidev/react-turnstile";
<Turnstile siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
  options={{ appearance: "interaction-only" }}
  onSuccess={t => form.setValue("turnstileToken", t, { shouldValidate: true })}
  onExpire={() => form.setValue("turnstileToken", "")} />
```

### `AttachmentUploader` (Vercel Blob client upload)
Server Actions have a small default body size limit, so files go **directly from the browser to storage**, and only URLs are sent with the form.

```tsx
"use client";
import { upload } from "@vercel/blob/client";

async function handleFiles(files: FileList) {
  for (const file of Array.from(files).slice(0, 3)) {
    if (file.size > 10 * 1024 * 1024) { /* show error */ continue; }
    const blob = await upload(`leads/${crypto.randomUUID()}-${file.name}`, file, {
      access: "public",
      handleUploadUrl: "/api/upload",
    });
    onAdd(blob.url);
  }
}
```

```ts
// src/app/api/upload/route.ts
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;
  const json = await handleUpload({
    body, request,
    onBeforeGenerateToken: async () => ({
      allowedContentTypes: ["application/pdf", "image/png", "image/jpeg", "image/webp",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/zip"],
      maximumSizeInBytes: 10 * 1024 * 1024,
      addRandomSuffix: true,
    }),
    onUploadCompleted: async () => {},
  });
  return NextResponse.json(json);
}
```
Rate-limit this route too. Uploaded URLs are unguessable, but for sensitive client documents consider private storage with signed URLs. Add a scheduled cleanup (Vercel Cron) for files older than 90 days that aren't linked to active projects.

UI: drag-and-drop zone (`onDragOver`/`onDrop`) plus a real `<input type="file" multiple>` for keyboard users; list of uploaded files with remove buttons and progress.

---

## 5. Server Action

```ts
// src/app/contact/actions.ts
"use server";
import { headers } from "next/headers";
import { Resend } from "resend";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { quoteSchema, type QuoteInput } from "@/lib/validation/quote";
import { saveLead } from "@/lib/leads";
import { LeadNotification } from "@/emails/LeadNotification";
import { ClientAutoReply } from "@/emails/ClientAutoReply";

const resend = new Resend(process.env.RESEND_API_KEY);
const ratelimit = new Ratelimit({ redis: Redis.fromEnv(), limiter: Ratelimit.slidingWindow(5, "1 h"), prefix: "quote" });

type Result = { ok: true } | { ok: false; error: string; fieldErrors?: Record<string, string> };

export async function submitQuote(input: QuoteInput): Promise<Result> {
  // 1. Rate limit
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { success } = await ratelimit.limit(ip);
  if (!success) return { ok: false, error: "Too many requests. Please try again later or contact us on WhatsApp." };

  // 2. Honeypot: pretend success so bots don't retry
  if (input.website) return { ok: true };

  // 3. Validate
  const parsed = quoteSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors = Object.fromEntries(parsed.error.issues.map(i => [i.path[0] as string, i.message]));
    return { ok: false, error: "Please fix the highlighted fields.", fieldErrors };
  }
  const data = parsed.data;

  // 4. Turnstile
  const verify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({ secret: process.env.TURNSTILE_SECRET_KEY!, response: data.turnstileToken, remoteip: ip }),
  }).then(r => r.json() as Promise<{ success: boolean }>);
  if (!verify.success) return { ok: false, error: "Verification failed. Please try again.", fieldErrors: { turnstileToken: "Please verify again" } };

  // 5. Save lead first
  let leadId: string;
  try {
    leadId = await saveLead({ ...data, ip, userAgent: h.get("user-agent") ?? "", createdAt: new Date().toISOString() });
  } catch (e) {
    console.error("saveLead failed", e);
    return { ok: false, error: "Something went wrong. Please email us at hello@pixarbyte.com." };
  }

  // 6–7. Emails in parallel; failures logged, not surfaced
  const results = await Promise.allSettled([
    resend.emails.send({
      from: "PixarByte Leads <leads@pixarbyte.com>",
      to: process.env.LEAD_NOTIFY_EMAIL!,
      replyTo: data.email,
      subject: `New lead: ${data.name} · ${data.services.join(", ")} · ${data.budget}`,
      react: LeadNotification({ lead: data, leadId }),
    }),
    resend.emails.send({
      from: "PixarByte <hello@pixarbyte.com>",
      to: data.email,
      subject: "We've received your project request",
      react: ClientAutoReply({ name: data.name.split(" ")[0] }),
    }),
  ]);
  results.forEach((r, i) => r.status === "rejected" && console.error(`email ${i} failed`, r.reason));

  return { ok: true };
}
```

Install: `npm i @upstash/ratelimit @upstash/redis @vercel/blob @marsidev/react-turnstile`. Add `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `BLOB_READ_WRITE_TOKEN` to env vars.

### Lead storage (`src/lib/leads.ts`)
Pick one to start; the function signature stays the same so you can switch later:

| Option | Effort | Notes |
|---|---|---|
| **Postgres (Neon/Supabase) + Drizzle** | Medium | Best long-term; enables an internal leads dashboard |
| **Google Sheets via service account** | Low | Easy for non-technical team to view |
| **CRM webhook** (HubSpot, Pipedrive, Zoho) | Low | Leads land directly in your sales pipeline |
| **Email only** | Lowest | Not recommended; emails can fail or get lost |

Example Postgres table:
```sql
create table leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text not null, email text not null, phone text, company text,
  client_type text not null, services text[] not null, project_type text,
  budget text not null, timeline text, description text not null,
  attachments text[] default '{}', source text, wants_nda boolean default false,
  meta jsonb, ip text, user_agent text,
  status text default 'new'   -- new | contacted | proposal | won | lost
);
```

---

## 6. Email Templates (React Email)

`src/emails/LeadNotification.tsx`: Table of all fields, clickable email/WhatsApp links (`https://wa.me/<digits>`), attachment links, NDA flag highlighted, budget and services at the top for quick triage.

`src/emails/ClientAutoReply.tsx`: Friendly branded message: thanks by first name, "we'll reply within 24 hours", Calendly link to book a call now, links to portfolio, signature with contact details. Keep it plain and light so it doesn't trigger spam filters.

Preview locally with `npx react-email dev`. Verify the sending domain in Resend (SPF, DKIM, DMARC records) before launch.

---

## 7. Sidebar Components

### `ContactOptions` (Server)
```tsx
const waText = encodeURIComponent("Hi PixarByte, I'd like to discuss a project.");
const options = [
  { icon: "Mail", label: "Email", value: siteConfig.email, href: `mailto:${siteConfig.email}` },
  { icon: "Phone", label: "Phone", value: siteConfig.phone, href: `tel:${siteConfig.phone.replace(/\s/g, "")}` },
  { icon: "MessageCircle", label: "WhatsApp", value: "Chat with us", href: `https://wa.me/${siteConfig.whatsapp}?text=${waText}`, event: "whatsapp_click" },
  { icon: "Calendar", label: "Book a call", value: "Free 30-min consultation", href: process.env.NEXT_PUBLIC_CALENDLY_URL!, event: "calendly_open" },
  { icon: "MapPin", label: "Office", value: siteConfig.address },
  { icon: "Clock", label: "Hours", value: `${siteConfig.hours} · Flexible for US, UK & Middle East time zones` },
];
```
External links use `TrackedLink` for analytics.

**Calendly:** Prefer a plain link (opens Calendly page) over an embedded widget; embeds add ~300KB of JS. If embedding, load with `next/script strategy="lazyOnload"` inside a Dialog opened on click.

### `Reassurance` (Server)
Checklist: response within 24h, free consultation, NDA available, no obligation. Optional rating badge.

### `NextSteps` (Server)
Shared `ProcessSection` with 4 custom steps.

### `OfficeMap` (Client, lazy)
Show a static map image first; replace with the Google Maps `<iframe loading="lazy">` only when the user clicks "Load map". Saves performance and avoids third-party cookies before consent.

---

## 8. Thank You Page

```tsx
// src/app/thank-you/page.tsx
export const metadata = { title: "Thank You", robots: { index: false, follow: false } };

export default async function ThankYouPage({ searchParams }: { searchParams: Promise<{ name?: string }> }) {
  const { name } = await searchParams;
  const safeName = name?.replace(/[^\p{L}\s'-]/gu, "").slice(0, 40);
  return (
    <Container className="py-24 text-center">
      <CheckCircle2 className="mx-auto size-16 text-accent-500" aria-hidden />
      <h1 className="mt-6 text-4xl font-bold">Thanks{safeName ? `, ${safeName}` : ""}!</h1>
      <p className="mt-4 text-lg">We've received your request and will reply within 24 hours.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Button asChild><a href={process.env.NEXT_PUBLIC_CALENDLY_URL}>Book a call now</a></Button>
        <Button variant="outline" asChild><Link href="/portfolio">See our work</Link></Button>
      </div>
      <SocialLinks />
      <ConversionPixel />
    </Container>
  );
}
```
Reading `searchParams` makes this route dynamic, which is fine for a small page. The name is sanitized before display (React escapes output anyway; this also trims junk).

`ConversionPixel` (client) fires Google Ads / Meta conversion events once per page load, only after cookie consent.

---

## 9. Security & Privacy Checklist

- Server-side validation always runs, regardless of client validation.
- Rate limiting on both the Server Action and `/api/upload`.
- Turnstile verified server-side; token never trusted from the client alone.
- Secrets only in server env vars.
- Upload type and size restricted server-side in `onBeforeGenerateToken`.
- Lead data stored with access limited to your team; document retention in the Privacy Policy.
- Consent checkbox required and stored with the lead.
- Don't log full lead content to third-party logging services.

---

## 10. Site-wide Quick Contact

- Header CTA → `/contact`.
- `WhatsAppButton` (fixed bottom-right, `z-40`, respects safe area on iOS with `bottom-[max(1rem,env(safe-area-inset-bottom))]`).
- `CTABanner` on most pages.
- Optional exit-intent dialog (desktop only, `mouseleave` on `document` toward top, show once per session via `sessionStorage`, never on `/contact` or `/thank-you`).

---

## 11. Testing

**Unit (Vitest)**
- `quoteSchema`: valid payload passes; missing email, short description, no services, consent false each fail with the right message.
- `prefillFromParams`: whitelists values; ignores unknown services.
- `submitQuote` with mocked Resend/Turnstile/Redis: honeypot returns ok without saving; failed Turnstile returns error; email failure still returns ok when lead saved.

**E2E (Playwright)** with Turnstile test keys (Cloudflare provides always-pass site/secret keys for testing) and Resend in test mode:
```ts
test("submits quote and lands on thank-you", async ({ page }) => {
  await page.goto("/contact?service=mobile-app-development");
  await expect(page.getByLabel("Mobile App Development")).toBeChecked();
  await page.getByLabel("Full Name").fill("Test User");
  await page.getByLabel("Email Address").fill("test@example.com");
  await page.getByLabel("Individual").check();
  await page.getByRole("combobox", { name: "Budget Range" }).click();
  await page.getByRole("option", { name: "$500–2,000" }).click();
  await page.getByLabel("Project Description").fill("I need a delivery app for my restaurant with tracking.");
  await page.getByLabel(/Privacy Policy/).check();
  await page.getByRole("button", { name: "Get My Free Quote" }).click();
  await expect(page).toHaveURL(/\/thank-you/);
});

test("shows validation errors", async ({ page }) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: "Get My Free Quote" }).click();
  await expect(page.getByText("Please enter your name")).toBeVisible();
});
```

## 12. Acceptance Criteria

- Valid submission stores the lead, emails the team, auto-replies the client, and redirects in under 3 seconds.
- Lead is never lost if an email provider fails.
- Bots filling the honeypot or failing Turnstile never create leads.
- Every field is labeled, errors are announced to screen readers, and the form is fully keyboard operable.
- Prefill works from service pages, pricing tiers, and the estimator.
- `/thank-you` is `noindex` and excluded in `robots.ts`.
