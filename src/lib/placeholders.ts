/** Text in [square brackets] marks content that must be replaced before launch. */
const PLACEHOLDER = /\[[^\]]+\]/;

/** Every placeholder string in a content object, with its path (e.g. `story.quote.cite`). */
export function findPlaceholders(value: unknown, path = ""): { path: string; text: string }[] {
  if (typeof value === "string") return PLACEHOLDER.test(value) ? [{ path, text: value }] : [];
  if (Array.isArray(value)) return value.flatMap((v, i) => findPlaceholders(v, `${path}[${i}]`));
  if (value && typeof value === "object")
    return Object.entries(value).flatMap(([k, v]) => findPlaceholders(v, path ? `${path}.${k}` : k));
  return [];
}
