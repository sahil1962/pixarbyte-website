import type { EstimateModel, ProjectSize, ProjectType } from "@/types/content";

export interface EstimateInput {
  type: ProjectType;
  size: ProjectSize;
  /** Feature ids; ids that don't belong to `type` are ignored. */
  features: string[];
}

export interface EstimateResult {
  /** Unrounded midpoint: base × size + features. */
  mid: number;
  /** Range ends, rounded to the nearest £100 as displayed. */
  low: number;
  high: number;
  /** Timeline in weeks, scaled by size. */
  weeks: [number, number];
}

/** Rounds to the nearest £100, as every estimate is displayed. */
export const roundEstimate = (amount: number) => Math.round(amount / 100) * 100;

/**
 * The one estimate calculation, shared by the quick estimate dialog and the /pricing
 * estimator, so both always agree. All amounts are GBP excluding VAT.
 */
export function estimate(model: EstimateModel, input: EstimateInput): EstimateResult {
  const m = model.sizeMultiplier[input.size];
  const features = model.features[input.type]
    .filter((f) => input.features.includes(f.id))
    .reduce((sum, f) => sum + f.price, 0);
  const mid = model.base[input.type] * m + features;
  const [w0, w1] = model.weeks[input.type];
  return {
    mid,
    low: roundEstimate(mid * model.spread.low),
    high: roundEstimate(mid * model.spread.high),
    weeks: [Math.round(w0 * m), Math.round(w1 * m)],
  };
}
