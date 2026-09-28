import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { realEnv } from "./env";

/**
 * Lead storage adapter. `saveLead()` is the only thing the form knows about, so the store
 * can change without touching it.
 *
 * - With LEADS_WEBHOOK_URL set, each lead is POSTed as JSON to that URL (a CRM, Zapier,
 *   Make or Google Sheets webhook). LEADS_WEBHOOK_SECRET, if set, is sent as a Bearer token.
 * - Otherwise, and whenever the webhook fails, leads are appended to a local JSON file:
 *   `.data/leads.json` in the project (git-ignored), or LEADS_FILE if set. Where the project
 *   folder is read-only (Vercel functions), the file goes in the system temp folder
 *   instead, which works for previews but isn't permanent: set up the webhook (or a
 *   database) before launch.
 */

export interface LeadRecord {
  kind: "quote" | "estimate";
  createdAt: string;
  ip: string;
  userAgent: string;
  /** The validated form data. */
  data: Record<string, unknown>;
}

export type StoredLead = LeadRecord & { id: string };
export type LeadStore = "webhook" | "file";

export interface SaveLeadResult {
  id: string;
  store: LeadStore;
  /** The webhook host or the JSON file path, for logs. */
  location: string;
}

export function leadStoreMode(): LeadStore {
  return realEnv("LEADS_WEBHOOK_URL") ? "webhook" : "file";
}

/* ---------- JSON file ---------- */

const PROJECT_FILE = path.join(process.cwd(), ".data", "leads.json");
const TEMP_FILE = path.join(os.tmpdir(), "pixarbyte", "leads.json");

function configuredFile(): string {
  return process.env.LEADS_FILE?.trim() || PROJECT_FILE;
}

async function readLeadsFrom(file: string): Promise<StoredLead[]> {
  try {
    const parsed: unknown = JSON.parse(await readFile(file, "utf8"));
    return Array.isArray(parsed) ? (parsed as StoredLead[]) : [];
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw e;
  }
}

async function appendTo(file: string, lead: StoredLead) {
  await mkdir(path.dirname(file), { recursive: true });
  const leads = await readLeadsFrom(file);
  leads.push(lead);
  // Write to a temporary file and rename, so a crash never leaves half a JSON file.
  const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
  await writeFile(tmp, JSON.stringify(leads, null, 2) + "\n", "utf8");
  await rename(tmp, file);
}

// One write at a time, so two leads arriving together can't overwrite each other.
let queue: Promise<unknown> = Promise.resolve();

async function saveToFile(lead: StoredLead): Promise<string> {
  const run = queue.then(async () => {
    const file = configuredFile();
    try {
      await appendTo(file, lead);
      return file;
    } catch (e) {
      const code = (e as NodeJS.ErrnoException).code;
      if (code !== "EROFS" && code !== "EACCES" && code !== "EPERM" && code !== "ENOENT") throw e;
      await appendTo(TEMP_FILE, lead);
      return TEMP_FILE;
    }
  });
  queue = run.catch(() => undefined);
  return run;
}

/** Every lead in the local JSON file (for tests and local checks). */
export async function readLocalLeads(file = configuredFile()): Promise<StoredLead[]> {
  return readLeadsFrom(file);
}

/* ---------- Webhook ---------- */

async function saveToWebhook(url: string, lead: StoredLead) {
  const secret = realEnv("LEADS_WEBHOOK_SECRET");
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json", ...(secret ? { authorization: `Bearer ${secret}` } : {}) },
    body: JSON.stringify(lead),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Lead webhook returned ${res.status}`);
  return new URL(url).host;
}

/* ---------- Public API ---------- */

export async function saveLead(record: LeadRecord): Promise<SaveLeadResult> {
  const lead: StoredLead = { id: randomUUID(), ...record };
  const webhook = realEnv("LEADS_WEBHOOK_URL");
  if (webhook) {
    try {
      return { id: lead.id, store: "webhook", location: await saveToWebhook(webhook, lead) };
    } catch (e) {
      // Never lose a lead: keep it locally and say so loudly.
      console.error("Lead webhook failed; saving the lead to the local JSON file instead", e);
    }
  }
  return { id: lead.id, store: "file", location: await saveToFile(lead) };
}
