"use server";

import { headers } from "next/headers";
import { estimateModel } from "@/data/pricing";
import { siteConfig } from "@/data/site";
import { sendEmail, type EmailMessage } from "@/lib/email";
import { estimate } from "@/lib/estimator";
import { estimateEmails, quoteEmails } from "@/lib/lead-emails";
import { saveLead } from "@/lib/leads";
import { rateLimit, type LimitBucket } from "@/lib/ratelimit";
import { clientIp } from "@/lib/request";
import { describeAttachments } from "@/lib/storage";
import { verifyTurnstile } from "@/lib/turnstile";
import { estimateRequestSchema, fieldErrorsFrom, formatPhone, quoteSchema } from "@/lib/validation/quote";

/**
 * Lead handling. Both actions run the same steps, in this order:
 * 1. rate limit by IP, 2. honeypot, 3. validate with the shared Zod schema,
 * 4. verify Turnstile, 5. save the lead, 6. send the team and client emails.
 * The lead is saved before any email is sent, and email failures are logged rather than
 * shown, so a failed email never loses a lead.
 */

export type ActionResult = { ok: true } | { ok: false; error: string; fieldErrors?: Record<string, string> };

const TOO_MANY = `Too many requests. Please try again in an hour, or email us at ${siteConfig.email}.`;
const GENERIC = `Something went wrong. Please try again, or email us at ${siteConfig.email}.`;

async function requestContext(bucket: LimitBucket) {
  const h = await headers();
  const ip = clientIp(h);
  const limit = await rateLimit(bucket, ip);
  return { ip, userAgent: h.get("user-agent")?.slice(0, 300) ?? "", allowed: limit.success };
}

/** Bots fill every field; people never see this one. */
function filledHoneypot(input: unknown): boolean {
  const v = (input as { website?: unknown } | null)?.website;
  return typeof v === "string" && v.length > 0;
}

async function sendAll(messages: EmailMessage[], leadId: string) {
  const results = await Promise.allSettled(messages.map((m) => sendEmail(m)));
  results.forEach((r, i) => {
    if (r.status === "rejected") console.error(`Lead ${leadId}: email ${i + 1} of ${messages.length} failed`, r.reason);
  });
}

export async function submitQuote(input: unknown): Promise<ActionResult> {
  const { ip, userAgent, allowed } = await requestContext("quote");
  if (!allowed) return { ok: false, error: TOO_MANY };

  // Pretend it worked, so bots don't retry.
  if (filledHoneypot(input)) return { ok: true };

  const parsed = quoteSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Please fix the highlighted fields.", fieldErrors: fieldErrorsFrom(parsed.error) };
  }
  const data = parsed.data;

  const human = await verifyTurnstile(data.turnstileToken, ip);
  if (!human.success) {
    return {
      ok: false,
      error: "We couldn't verify you're human. Please try again.",
      fieldErrors: { turnstileToken: "Please complete the verification again" },
    };
  }

  const createdAt = new Date().toISOString();
  const attachments = await describeAttachments(data.attachments);
  let leadId: string;
  try {
    // The Turnstile token and the (empty) honeypot aren't worth keeping.
    const fields: Partial<typeof data> = { ...data };
    delete fields.turnstileToken;
    delete fields.website;
    const saved = await saveLead({
      kind: "quote",
      createdAt,
      ip,
      userAgent,
      data: {
        ...fields,
        phone: formatPhone(data.phoneCountry, data.phone || undefined) ?? "",
        attachments,
        consentAt: createdAt,
      },
    });
    leadId = saved.id;
    console.info(`Lead ${leadId} saved (${saved.store}: ${saved.location})`);
  } catch (e) {
    console.error("saveLead failed", e);
    return { ok: false, error: GENERIC };
  }

  const { team, client } = quoteEmails({ data, leadId, attachments, receivedAt: createdAt });
  await sendAll([team, client], leadId);
  return { ok: true };
}

export async function requestEstimate(input: unknown): Promise<ActionResult> {
  const { ip, userAgent, allowed } = await requestContext("estimate");
  if (!allowed) return { ok: false, error: TOO_MANY };
  if (filledHoneypot(input)) return { ok: true };

  const parsed = estimateRequestSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors = fieldErrorsFrom(parsed.error);
    return {
      ok: false,
      error: fieldErrors.email ?? fieldErrors.turnstileToken ?? "Please check your details.",
      fieldErrors,
    };
  }
  // Keep only feature ids that belong to this project type.
  const data = {
    ...parsed.data,
    features: parsed.data.features.filter((id) => estimateModel.features[parsed.data.type].some((f) => f.id === id)),
  };

  const human = await verifyTurnstile(data.turnstileToken, ip);
  if (!human.success) return { ok: false, error: "We couldn't verify you're human. Please try again." };

  // Price it here from the shared model; the browser's figures are never trusted.
  const result = estimate(estimateModel, { type: data.type, size: data.size, features: data.features });
  const createdAt = new Date().toISOString();
  let leadId: string;
  try {
    const saved = await saveLead({
      kind: "estimate",
      createdAt,
      ip,
      userAgent,
      data: {
        email: data.email,
        type: data.type,
        size: data.size,
        features: data.features,
        low: result.low,
        high: result.high,
        weeks: result.weeks,
      },
    });
    leadId = saved.id;
    console.info(`Lead ${leadId} saved (${saved.store}: ${saved.location})`);
  } catch (e) {
    console.error("saveLead failed", e);
    return { ok: false, error: GENERIC };
  }

  const { team, client } = estimateEmails({ data, result, leadId, receivedAt: createdAt });
  await sendAll([client, team], leadId);
  return { ok: true };
}
