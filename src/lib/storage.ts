import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { realEnv } from "./env";
import { allowedFileTypes, MAX_FILE_BYTES, safeFileName, type Attachment } from "./validation/quote";

/**
 * Attachment storage adapter.
 *
 * - With BLOB_READ_WRITE_TOKEN set, files go straight from the browser to Vercel Blob
 *   (client uploads, so they skip the serverless request size limit). /api/upload only
 *   issues short-lived upload tokens, restricted to our file types and size.
 * - Without it, the browser posts the file to /api/upload, which keeps it in the system
 *   temp folder (or in memory if that isn't writable) and returns a `temp:<id>` reference.
 *   Those files are for demos only: they disappear on restart and are labelled
 *   "stored temporarily" in the lead email.
 */

export type StorageMode = "blob" | "temporary";

export function storageMode(): StorageMode {
  return realEnv("BLOB_READ_WRITE_TOKEN") ? "blob" : "temporary";
}

/* ---------- Vercel Blob (client uploads) ---------- */

/** Handles the token exchange for `upload()` from `@vercel/blob/client`. */
export async function handleBlobUpload(request: Request, body: HandleUploadBody) {
  return handleUpload({
    token: realEnv("BLOB_READ_WRITE_TOKEN"),
    request,
    body,
    onBeforeGenerateToken: async (pathname) => {
      if (!pathname.startsWith("leads/")) throw new Error("Uploads must go in leads/");
      return {
        allowedContentTypes: Object.keys(allowedFileTypes),
        maximumSizeInBytes: MAX_FILE_BYTES,
        addRandomSuffix: true,
        validUntil: Date.now() + 10 * 60 * 1000,
      };
    },
  });
}

/* ---------- Temporary storage ---------- */

interface TempFile {
  name: string;
  type: string;
  size: number;
  /** Where the file is: a path in the temp folder, or "memory". */
  location: string;
  bytes?: Uint8Array;
}

const TEMP_DIR = path.join(os.tmpdir(), "pixarbyte-uploads");
// Shared through globalThis: the upload route and the Server Action are bundled separately.
const store = globalThis as typeof globalThis & { __pixarbyteTempFiles?: Map<string, TempFile> };
const tempFiles = (store.__pixarbyteTempFiles ??= new Map<string, TempFile>());
const TEMP_ID = /^[0-9a-f-]{36}$/;

export async function saveTemporaryFile(file: {
  name: string;
  type: string;
  bytes: Uint8Array;
}): Promise<Attachment & { location: string }> {
  const id = randomUUID();
  const name = safeFileName(file.name);
  let location = "memory";
  let bytes: Uint8Array | undefined;
  try {
    const dir = path.join(TEMP_DIR, id);
    await mkdir(dir, { recursive: true });
    location = path.join(dir, name);
    await writeFile(location, file.bytes);
  } catch {
    location = "memory";
    bytes = file.bytes;
  }
  // Only a few demo files are ever kept in memory; drop the oldest beyond 50.
  if (tempFiles.size >= 50) tempFiles.delete(tempFiles.keys().next().value!);
  tempFiles.set(id, { name, type: file.type, size: file.bytes.byteLength, location, bytes });
  return { name, size: file.bytes.byteLength, url: `temp:${id}`, location };
}

/* ---------- Describing attachments for the lead ---------- */

export interface AttachmentInfo {
  name: string;
  size: number;
  /** A public link for Blob files; none for temporary files. */
  href?: string;
  temporary: boolean;
  /** Where a temporary file is kept (its path, "memory", or "expired"). */
  location?: string;
}

/**
 * What the team email and the lead record say about each attachment. Temporary files are
 * looked up on this server; Blob URLs were already checked by the schema.
 */
export async function describeAttachments(list: Attachment[]): Promise<AttachmentInfo[]> {
  return Promise.all(
    list.map(async (a) => {
      if (!a.url.startsWith("temp:")) return { name: a.name, size: a.size, href: a.url, temporary: false };
      const id = a.url.slice(5);
      const known = tempFiles.get(id);
      if (known) return { name: known.name, size: known.size, temporary: true, location: known.location };
      // Not in this process's memory: look for it in the temp folder.
      if (TEMP_ID.test(id)) {
        try {
          const dir = path.join(TEMP_DIR, id);
          const [file] = await readdir(dir);
          if (file) {
            const location = path.join(dir, file);
            return { name: file, size: (await stat(location)).size, temporary: true, location };
          }
        } catch {
          // Gone (restarted server, or another instance): fall through.
        }
      }
      return { name: a.name, size: a.size, temporary: true, location: "expired" };
    }),
  );
}
