import type { EstimateModel, ProjectSize, ProjectType } from "@/types/content";
import { estimate } from "@/lib/estimator";
import { formatEstimate } from "@/lib/format";
import {
  clientTypes,
  serviceOptions,
  type ClientType,
  type QuoteFormValues,
  type ServiceOption,
} from "@/lib/validation/quote";

/**
 * Builds the quote form's starting values from the URL, so other pages can link here with
 * context: `?service=` from service pages, `?type=` from the estimator and audience cards,
 * `?package=` from pricing tiers, `?model=` from engagement models and `?estimate=` (with
 * `size` and `features`) from the cost estimator. Every value is whitelisted; anything
 * unknown is ignored.
 */

const projectTypeToService: Record<ProjectType, ServiceOption> = {
  website: "frontend-development",
  mobile: "mobile-app-development",
  webapp: "full-stack-development",
  nocode: "no-code-development",
  cloud: "cloud-services",
};

const projectTypeLabel: Record<ProjectType, string> = {
  website: "a website",
  mobile: "a mobile app",
  webapp: "a web app",
  nocode: "a no-code build",
  cloud: "cloud work",
};

const sizeLabel: Record<ProjectSize, string> = { s: "small", m: "medium", l: "large" };

const PACKAGE = /^[a-z0-9-]{2,60}$/;
const MODELS = ["fixed", "hourly", "dedicated", "maintenance"] as const;
const modelLabel: Record<(typeof MODELS)[number], string> = {
  fixed: "a fixed-price project",
  hourly: "hourly work",
  dedicated: "a dedicated developer",
  maintenance: "maintenance and support",
};

function isOneOf<T extends string>(list: readonly T[], v: string | null): v is T {
  return v !== null && (list as readonly string[]).includes(v);
}

export interface PrefillContext {
  model: EstimateModel;
  /** Package id → readable name, e.g. "websites-business" → "Websites: Business". */
  packages: Record<string, string>;
}

export function prefillFromParams(p: URLSearchParams, ctx: PrefillContext): Partial<QuoteFormValues> {
  const out: Partial<QuoteFormValues> = {};
  const meta: NonNullable<QuoteFormValues["meta"]> = {};
  const lines: string[] = [];

  const service = p.get("service");
  if (isOneOf(serviceOptions, service)) out.services = [service];

  // `type` is either an audience (individual/business) or a project type from the estimator.
  const type = p.get("type");
  if (isOneOf<ClientType>(clientTypes, type)) out.clientType = type;
  const projectType = type && type in projectTypeToService ? (type as ProjectType) : null;
  if (projectType && !out.services) out.services = [projectTypeToService[projectType]];

  const pkg = p.get("package");
  if (pkg && PACKAGE.test(pkg) && ctx.packages[pkg]) {
    meta.package = pkg;
    lines.push(`I'm interested in the ${ctx.packages[pkg]} package.`);
  }

  const model = p.get("model");
  if (isOneOf(MODELS, model)) {
    meta.model = model;
    lines.push(`I'd like to talk about ${modelLabel[model]}.`);
  }

  // The cost estimator sends its inputs; the range is recalculated here, not trusted.
  if (projectType && p.has("estimate")) {
    const size = p.get("size");
    const s: ProjectSize = size === "m" || size === "l" ? size : "s";
    const allowed = ctx.model.features[projectType];
    const ids = (p.get("features") ?? "").split(",").filter((id) => allowed.some((f) => f.id === id));
    const r = estimate(ctx.model, { type: projectType, size: s, features: ids });
    const range = `${formatEstimate(r.low)} – ${formatEstimate(r.high)}`;
    const names = allowed.filter((f) => ids.includes(f.id)).map((f) => f.label.toLowerCase());
    meta.estimate = `${projectType}, ${sizeLabel[s]}${ids.length ? `, ${ids.join("+")}` : ""}: ${range}`;
    lines.push(
      `I used your cost estimator for ${projectTypeLabel[projectType]} (${sizeLabel[s]}${
        names.length ? `, with ${names.join(", ")}` : ""
      }). It suggested ${range}, ${r.weeks[0]} to ${r.weeks[1]} weeks.`,
    );
  }

  if (Object.keys(meta).length) out.meta = meta;
  if (lines.length) out.description = `${lines.join(" ")}\n\n`;
  return out;
}
