"use client";

import { useEffect, useRef, useState, type DragEvent } from "react";
import { Icon } from "@/components/shared/Icon";
import { fill } from "@/lib/format";
import type { StorageMode } from "@/lib/storage";
import { allowedFileTypes, checkFile, MAX_FILES, safeFileName, type Attachment } from "@/lib/validation/quote";

type Copy = {
  label: string;
  hint: string;
  button: string;
  drop: string;
  uploading: string;
  remove: string;
  tooMany: string;
  tooBig: string;
  badType: string;
  failed: string;
  temporary: string;
};

function formatSize(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1048576).toFixed(1)} MB`;
}

async function uploadFile(file: File, mode: StorageMode): Promise<Attachment> {
  if (mode === "blob") {
    // Straight from the browser to Vercel Blob; /api/upload only issues the token.
    const { upload } = await import("@vercel/blob/client");
    const blob = await upload(`leads/${crypto.randomUUID()}-${safeFileName(file.name)}`, file, {
      access: "public",
      handleUploadUrl: "/api/upload",
      contentType: file.type,
    });
    return { name: file.name, size: file.size, url: blob.url };
  }
  const body = new FormData();
  body.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body });
  if (!res.ok) throw new Error(`Upload failed (${res.status})`);
  const json = (await res.json()) as Attachment;
  return { name: json.name, size: json.size, url: json.url };
}

/**
 * Up to three attachments: a real file input (keyboard and screen reader friendly) plus
 * drag and drop. Files upload as soon as they're chosen; the form sends only references.
 */
export function AttachmentUploader({
  id,
  value,
  onChange,
  mode,
  copy,
  describedBy,
}: {
  id: string;
  value: Attachment[];
  onChange(next: Attachment[]): void;
  mode: StorageMode;
  copy: Copy;
  describedBy?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  const latest = useRef(value);
  useEffect(() => {
    latest.current = value;
  }, [value]);

  async function addFiles(list: FileList | null) {
    if (!list?.length) return;
    const problems: string[] = [];
    const room = MAX_FILES - latest.current.length - busy;
    const files = Array.from(list);
    if (files.length > room) problems.push(copy.tooMany);
    const accepted = files.slice(0, Math.max(0, room)).filter((f) => {
      const p = checkFile(f);
      if (p) problems.push(fill(copy[p], { name: f.name }));
      return !p;
    });
    setErrors(problems);
    if (input.current) input.current.value = "";

    setBusy((n) => n + accepted.length);
    await Promise.all(
      accepted.map(async (f) => {
        try {
          const a = await uploadFile(f, mode);
          latest.current = [...latest.current, a];
          onChange(latest.current);
        } catch {
          setErrors((e) => [...e, fill(copy.failed, { name: f.name })]);
        } finally {
          setBusy((n) => n - 1);
        }
      }),
    );
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    void addFiles(e.dataTransfer.files);
  }

  const full = value.length + busy >= MAX_FILES;

  return (
    <div>
      <div
        className="check flex-wrap justify-center border-dashed py-5 text-center"
        style={dragging ? { borderColor: "var(--foreground)", background: "var(--muted-2)" } : undefined}
        onDragOver={(e) => {
          e.preventDefault();
          if (!full) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <input
          ref={input}
          id={id}
          type="file"
          multiple
          className="sr-only"
          accept={Object.entries(allowedFileTypes)
            .flatMap(([type, ext]) => [type, ext])
            .join(",")}
          aria-describedby={describedBy}
          disabled={full}
          onChange={(e) => void addFiles(e.target.files)}
        />
        <button type="button" className="btn btn-outline" disabled={full} onClick={() => input.current?.click()}>
          <Icon name="file" />
          {copy.button}
        </button>
        <span className="text-muted-foreground">{copy.drop}</span>
      </div>

      <div aria-live="polite">
        {busy > 0 && <p className="ctrl-note mt-2 mb-0">{copy.uploading}</p>}
        {errors.map((e) => (
          <p key={e} className="err-msg" role="alert">
            {e}
          </p>
        ))}
      </div>

      {value.length > 0 && (
        <ul className="m-0 mt-3 grid list-none gap-2 p-0">
          {value.map((a) => (
            <li key={a.url} className="check cursor-default">
              <Icon name="file" />
              <span className="min-w-0 truncate">{a.name}</span>
              <small>
                {formatSize(a.size)}
                {a.url.startsWith("temp:") ? ` · ${copy.temporary}` : ""}
              </small>
              <button
                type="button"
                className="btn btn-ghost btn-icon"
                aria-label={fill(copy.remove, { name: a.name })}
                onClick={() => onChange(value.filter((x) => x.url !== a.url))}
              >
                <Icon name="x" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
