import "server-only";
import type { ReactElement } from "react";
import { render } from "@react-email/components";
import { Resend } from "resend";
import { siteConfig } from "@/data/site";
import { realEnv } from "./env";

/**
 * Email adapter. With a real RESEND_API_KEY it sends through Resend. Without one (or with
 * the sample value from `.env.example`) nothing is sent: the whole email, including its
 * rendered text and HTML, is written to the server console instead, and the caller carries
 * on as if it had been sent.
 */

export type EmailMode = "resend" | "console";

export interface EmailMessage {
  to: string | string[];
  subject: string;
  react: ReactElement;
  replyTo?: string;
  from?: string;
}

export interface EmailResult {
  mode: EmailMode;
  id: string | null;
}

export function emailMode(): EmailMode {
  return realEnv("RESEND_API_KEY") ? "resend" : "console";
}

/** Sender for every email. Must be on a domain verified in Resend. */
export function emailFrom(): string {
  return process.env.EMAIL_FROM?.trim() || `${siteConfig.name} <${siteConfig.email}>`;
}

/** Where new-lead notifications go. */
export function teamInbox(): string {
  return process.env.LEAD_NOTIFY_EMAIL?.trim() || siteConfig.email;
}

export async function sendEmail(message: EmailMessage): Promise<EmailResult> {
  const from = message.from ?? emailFrom();
  const [html, text] = await Promise.all([render(message.react), render(message.react, { plainText: true })]);
  const key = realEnv("RESEND_API_KEY");

  if (!key) {
    const to = Array.isArray(message.to) ? message.to.join(", ") : message.to;
    console.info(
      [
        "",
        "──────── Email not sent (RESEND_API_KEY is not set). Full message: ────────",
        `From:     ${from}`,
        `To:       ${to}`,
        ...(message.replyTo ? [`Reply-To: ${message.replyTo}`] : []),
        `Subject:  ${message.subject}`,
        "",
        "── Text ──",
        text,
        "",
        "── HTML ──",
        html,
        "──────── End of email ────────",
        "",
      ].join("\n"),
    );
    return { mode: "console", id: null };
  }

  const resend = new Resend(key);
  const { data, error } = await resend.emails.send({
    from,
    to: message.to,
    subject: message.subject,
    html,
    text,
    ...(message.replyTo ? { replyTo: message.replyTo } : {}),
  });
  if (error) throw new Error(`Resend rejected the email: ${error.message}`);
  return { mode: "resend", id: data?.id ?? null };
}
