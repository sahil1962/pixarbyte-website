import type { HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/ratelimit";
import { clientIp } from "@/lib/request";
import { handleBlobUpload, saveTemporaryFile, storageMode } from "@/lib/storage";
import { checkFile } from "@/lib/validation/quote";

/**
 * Attachment uploads for the quote form (max 3 files of 10 MB, checked here and in the form).
 *
 * - JSON body: the Vercel Blob client-upload token exchange (when BLOB_READ_WRITE_TOKEN is set).
 * - multipart/form-data with a `file` field: temporary storage while Blob isn't configured.
 */
export async function POST(request: Request) {
  const limit = await rateLimit("upload", clientIp(request.headers));
  if (!limit.success) {
    return NextResponse.json({ error: "Too many uploads. Please try again later." }, { status: 429 });
  }

  const type = request.headers.get("content-type") ?? "";

  if (type.includes("application/json")) {
    if (storageMode() !== "blob") {
      return NextResponse.json({ error: "Blob storage isn't configured." }, { status: 400 });
    }
    try {
      const body = (await request.json()) as HandleUploadBody;
      return NextResponse.json(await handleBlobUpload(request, body));
    } catch (e) {
      return NextResponse.json({ error: (e as Error).message }, { status: 400 });
    }
  }

  if (type.includes("multipart/form-data")) {
    let file: FormDataEntryValue | null;
    try {
      file = (await request.formData()).get("file");
    } catch {
      return NextResponse.json({ error: "The upload couldn't be read." }, { status: 400 });
    }
    if (!(file instanceof File)) return NextResponse.json({ error: "No file was sent." }, { status: 400 });
    const problem = checkFile(file);
    if (problem === "badType") return NextResponse.json({ error: "That file type isn't accepted." }, { status: 415 });
    if (problem === "tooBig") return NextResponse.json({ error: "Files must be 10 MB or smaller." }, { status: 413 });

    const saved = await saveTemporaryFile({
      name: file.name,
      type: file.type,
      bytes: new Uint8Array(await file.arrayBuffer()),
    });
    return NextResponse.json({ name: saved.name, size: saved.size, url: saved.url, temporary: true });
  }

  return NextResponse.json({ error: "Unsupported request." }, { status: 415 });
}
