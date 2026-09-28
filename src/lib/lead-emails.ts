import "server-only";
import { createElement } from "react";
import { builder } from "@/data/builder";
import { quoteOptions } from "@/data/contact";
import { estimateContent, estimateModel } from "@/data/pricing";
import { siteConfig } from "@/data/site";
import { ClientAutoReply } from "@/emails/ClientAutoReply";
import { EstimateEmail } from "@/emails/EstimateEmail";
import { LeadNotification, type LeadRow } from "@/emails/LeadNotification";
import type { EstimateResult } from "@/lib/estimator";
import { formatEstimate } from "@/lib/format";
import { isConfigured } from "./env";
import type { EmailMessage } from "./email";
import { teamInbox } from "./email";
import type { AttachmentInfo } from "./storage";
import { formatPhone, phoneDigits, type EstimateRequest, type QuoteInput } from "./validation/quote";

/** Builds the team notification and the client email for each kind of lead. */

const footer = {
  name: siteConfig.name,
  email: siteConfig.email,
  phone: siteConfig.phone.display,
  url: siteConfig.url,
  location: siteConfig.location,
};

export function bookingUrl(): string | undefined {
  const url = process.env.NEXT_PUBLIC_CALENDLY_URL;
  return isConfigured(url) ? url : undefined;
}

const ukTime = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/London" }).format(
    new Date(iso),
  );

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} bytes`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const firstName = (name: string) => name.trim().split(/\s+/)[0] ?? name;

export function quoteEmails({
  data,
  leadId,
  attachments,
  receivedAt,
}: {
  data: QuoteInput;
  leadId: string;
  attachments: AttachmentInfo[];
  receivedAt: string;
}): { team: EmailMessage; client: EmailMessage } {
  const services = data.services.map((s) => quoteOptions.services[s]).join(", ");
  const budget = quoteOptions.budgets[data.budget];
  const phone = formatPhone(data.phoneCountry, data.phone || undefined);

  const rows: LeadRow[] = [
    { label: "Name", value: data.name },
    { label: "Email", value: data.email, href: `mailto:${data.email}` },
    ...(phone
      ? [
          { label: "Phone", value: phone, href: `tel:+${phoneDigits(phone)}` },
          { label: "WhatsApp", value: "Open a chat", href: `https://wa.me/${phoneDigits(phone)}` },
        ]
      : []),
    ...(data.company ? [{ label: "Company", value: data.company }] : []),
    { label: "Client type", value: quoteOptions.clientTypes[data.clientType].label },
    ...(data.projectType ? [{ label: "Project type", value: quoteOptions.projectTypes[data.projectType] }] : []),
    ...(data.source ? [{ label: "Heard about us", value: quoteOptions.sources[data.source] }] : []),
    ...(data.meta?.package ? [{ label: "Package", value: data.meta.package }] : []),
    ...(data.meta?.model ? [{ label: "Engagement model", value: data.meta.model }] : []),
    ...(data.meta?.estimate ? [{ label: "Estimator", value: data.meta.estimate }] : []),
  ];

  const team: EmailMessage = {
    to: teamInbox(),
    replyTo: data.email,
    subject: `New lead: ${data.name} · ${services} · ${budget}`,
    react: createElement(LeadNotification, {
      leadId,
      heading: `New project request from ${data.name}`,
      highlights: [
        { label: "Budget", value: budget },
        { label: "Services", value: services },
        ...(data.timeline ? [{ label: "Start", value: quoteOptions.timelines[data.timeline] }] : []),
      ],
      rows,
      description: data.description,
      attachments: attachments.map((a) => ({
        name: a.name,
        size: formatBytes(a.size),
        href: a.href,
        note: a.temporary
          ? `stored temporarily (${a.location === "expired" ? "no longer on this server" : a.location}); set up Vercel Blob to keep files`
          : undefined,
      })),
      wantsNda: data.wantsNda,
      receivedAt: ukTime(receivedAt),
      footer,
    }),
  };

  const client: EmailMessage = {
    to: data.email,
    replyTo: teamInbox(),
    subject: "We've received your project request",
    react: createElement(ClientAutoReply, {
      firstName: firstName(data.name),
      bookingUrl: bookingUrl(),
      portfolioUrl: `${siteConfig.url}/portfolio`,
      summary: services,
      footer,
    }),
  };

  return { team, client };
}

export function estimateEmails({
  data,
  result,
  leadId,
  receivedAt,
}: {
  data: EstimateRequest;
  result: EstimateResult;
  leadId: string;
  receivedAt: string;
}): { team: EmailMessage; client: EmailMessage } {
  const typeLabel = builder.projects.find((p) => p.key === data.type)?.label ?? data.type;
  const sizeLabel = estimateContent.sizes.find((s) => s.id === data.size)?.label ?? data.size;
  const features = estimateModel.features[data.type]
    .filter((f) => data.features.includes(f.id))
    .map((f) => ({ label: f.label, price: formatEstimate(f.price) }));
  const range = `${formatEstimate(result.low)} – ${formatEstimate(result.high)}`;
  const timeline = `${result.weeks[0]} to ${result.weeks[1]} weeks`;
  const quoteUrl = `${siteConfig.url}/contact?type=${data.type}&size=${data.size}&features=${encodeURIComponent(
    data.features.join(","),
  )}&estimate=1`;

  const team: EmailMessage = {
    to: teamInbox(),
    replyTo: data.email,
    subject: `New estimate request: ${typeLabel} · ${range}`,
    react: createElement(LeadNotification, {
      leadId,
      heading: `Quick estimate sent to ${data.email}`,
      highlights: [
        { label: "Estimated range", value: range },
        { label: "Project", value: `${typeLabel}, ${sizeLabel.toLowerCase()}` },
      ],
      rows: [
        { label: "Email", value: data.email, href: `mailto:${data.email}` },
        { label: "Extras", value: features.map((f) => f.label).join(", ") || "None" },
        { label: "Timeline", value: timeline },
      ],
      receivedAt: ukTime(receivedAt),
      footer,
    }),
  };

  const client: EmailMessage = {
    to: data.email,
    replyTo: teamInbox(),
    subject: `Your ${typeLabel.toLowerCase()} estimate from ${siteConfig.name}`,
    react: createElement(EstimateEmail, {
      typeLabel,
      sizeLabel,
      features,
      range,
      timeline,
      quoteUrl,
      bookingUrl: bookingUrl(),
      footer,
    }),
  };

  return { team, client };
}
