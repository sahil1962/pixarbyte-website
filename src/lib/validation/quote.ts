import { z } from "zod";

/**
 * The quote form's schema. The browser (React Hook Form) and the Server Action both
 * validate with this one schema, so the rules can't drift apart. Labels for each option
 * live in `src/data/contact.ts`.
 */

export const clientTypes = ["individual", "startup", "business", "agency"] as const;
export const serviceOptions = [
  "frontend-development",
  "backend-development",
  "full-stack-development",
  "no-code-development",
  "mobile-app-development",
  "cloud-services",
  "not-sure",
] as const;
/** GBP, excluding VAT. */
export const budgetOptions = ["under-5k", "5k-15k", "15k-30k", "30k-60k", "60k-plus", "not-sure"] as const;
export const timelineOptions = ["asap", "1-3m", "3-6m", "flexible"] as const;
export const projectTypes = ["new", "redesign", "features", "maintenance", "consultation"] as const;
export const sourceOptions = ["search", "referral", "social", "portfolio", "other"] as const;
/** Dialling codes offered next to the phone field. UK first and the default. */
export const phoneCountries = ["+44", "+353", "+1", "+61", "+49", "+33", "+971", "+91"] as const;

export type ClientType = (typeof clientTypes)[number];
export type ServiceOption = (typeof serviceOptions)[number];
export type BudgetOption = (typeof budgetOptions)[number];
export type TimelineOption = (typeof timelineOptions)[number];
export type ProjectKind = (typeof projectTypes)[number];
export type SourceOption = (typeof sourceOptions)[number];

/* ---------- Attachments ---------- */

export const MAX_FILES = 3;
export const MAX_FILE_BYTES = 10 * 1024 * 1024;
/** File types we accept, by MIME type, with the extensions shown to visitors. */
export const allowedFileTypes: Record<string, string> = {
  "application/pdf": ".pdf",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
  "text/plain": ".txt",
  "application/zip": ".zip",
};

/**
 * An uploaded file as the form sends it: a Vercel Blob URL, or `temp:<id>` for a file kept
 * in temporary storage while Blob isn't configured.
 */
export const attachmentSchema = z.object({
  name: z.string().trim().min(1).max(200),
  size: z.number().int().min(0).max(MAX_FILE_BYTES),
  url: z
    .string()
    .max(2048)
    .refine(
      (u) => /^temp:[a-z0-9-]{8,80}$/i.test(u) || /^https:\/\/[a-z0-9.-]+\.blob\.vercel-storage\.com\//i.test(u),
      {
        message: "Unknown file location",
      },
    ),
});
export type Attachment = z.infer<typeof attachmentSchema>;

/** Why a file can't be attached, or null if it's fine. Used by the browser and /api/upload. */
export function checkFile(file: { name: string; type: string; size: number }): "badType" | "tooBig" | null {
  if (!(file.type in allowedFileTypes)) return "badType";
  if (file.size > MAX_FILE_BYTES) return "tooBig";
  return null;
}

/** A safe file name for storage: letters, digits, dots, dashes and underscores only. */
export function safeFileName(name: string): string {
  const cleaned = name
    .normalize("NFKD")
    .replace(/[^\w.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-.]+/, "")
    .slice(-100);
  return cleaned || "file";
}

/* ---------- Helpers ---------- */

/** An optional select or text field: empty ("" when nothing is chosen) or valid. */
function optional<T extends z.ZodType>(schema: T) {
  return schema.optional().or(z.literal(""));
}

const PHONE = /^\+?[0-9][0-9\s()-]{5,19}$/;

/* ---------- The quote form ---------- */

export const quoteSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100, "Please keep your name under 100 characters"),
  email: z.string().trim().max(254).email("Please enter a valid email address, like you@company.co.uk"),
  phoneCountry: z.enum(phoneCountries).default("+44"),
  phone: optional(z.string().trim().max(30).regex(PHONE, "Please enter a valid phone number, like 07700 900123")),
  company: optional(z.string().trim().max(120, "Please keep this under 120 characters")),
  clientType: z.enum(clientTypes, { message: "Please choose one" }),
  services: z.array(z.enum(serviceOptions)).min(1, "Please choose at least one service").max(serviceOptions.length),
  projectType: optional(z.enum(projectTypes)),
  budget: z.enum(budgetOptions, { message: "Please choose a budget range" }),
  timeline: optional(z.enum(timelineOptions)),
  description: z
    .string()
    .trim()
    .min(20, "Please tell us a bit more (at least 20 characters)")
    .max(5000, "Please keep this under 5,000 characters"),
  attachments: z.array(attachmentSchema).max(MAX_FILES, `Up to ${MAX_FILES} files`).default([]),
  source: optional(z.enum(sourceOptions)),
  wantsNda: z.boolean().default(false),
  consent: z.literal(true, { message: "Please accept the privacy notice to continue" }),
  turnstileToken: z.string().min(1, "Please complete the verification").max(4096),
  /** Honeypot: hidden from people, so it must stay empty. */
  website: z.string().max(0).optional(),
  meta: z
    .object({
      estimate: z.string().max(500).optional(),
      package: z.string().max(80).optional(),
      model: z.string().max(40).optional(),
    })
    .optional(),
});

/** What the form holds while it's being filled in (before defaults are applied). */
export type QuoteFormValues = z.input<typeof quoteSchema>;
/** What the Server Action works with once the input has been validated. */
export type QuoteInput = z.output<typeof quoteSchema>;

/* ---------- The quick estimate dialog ---------- */

export const estimateRequestSchema = z.object({
  email: z.string().trim().max(254).email("Enter a valid email address, like you@company.co.uk."),
  type: z.enum(["website", "mobile", "webapp", "nocode", "cloud"]),
  size: z.enum(["s", "m", "l"]),
  features: z.array(z.string().max(40)).max(20).default([]),
  turnstileToken: z.string().min(1, "Please complete the verification").max(4096),
  website: z.string().max(0).optional(),
});
export type EstimateRequest = z.output<typeof estimateRequestSchema>;

/* ---------- Formatting ---------- */

/**
 * The phone number in international form, e.g. "+44 7700 900123". A UK number typed with
 * its leading 0 loses it; a number that already starts with + is kept as typed.
 */
export function formatPhone(country: string, phone: string | undefined): string | undefined {
  const p = phone?.trim();
  if (!p) return undefined;
  if (p.startsWith("+")) return p.replace(/\s+/g, " ");
  const national = p
    .replace(/[^\d\s]/g, "")
    .trim()
    .replace(/^0+/, "");
  return `${country} ${national}`.replace(/\s+/g, " ");
}

/** Digits only, for wa.me and tel: links. */
export function phoneDigits(international: string): string {
  return international.replace(/\D/g, "");
}

/** Field errors keyed by top-level field name (the first message for each). */
export function fieldErrorsFrom(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    out[key] ??= issue.message;
  }
  return out;
}
