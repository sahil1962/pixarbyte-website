const gbp = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });

/** £15,000 */
export function formatGBP(amount: number) {
  return gbp.format(amount);
}

/** Estimator style: rounded to the nearest £100. */
export function formatEstimate(amount: number) {
  return "£" + (Math.round(amount / 100) * 100).toLocaleString("en-GB");
}

/** Replaces `{key}` tokens in a template string. */
export function fill(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}

/** "Ali Raza" → "AR" */
export function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("");
}

/** Ease-out cubic, used by every count-up in the design. */
export function easeOutCubic(p: number) {
  return 1 - Math.pow(1 - p, 3);
}
